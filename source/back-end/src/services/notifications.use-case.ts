import { makeAppointmentsUseCaseFactory } from '@/factory/make-appointments-use-case.factory'
import { TokenPayload } from '@/middlewares/auth/verify-jwt-token.middleware'
import { NotificationFilters } from '@/types/notifications/notification-filters'
import { PaginatedRequest } from '@/types/pagination'
import { type Notification } from '@prisma/client'
import { type NotificationRepository } from '../repository/protocols/notification.repository'
import { RecordExistence } from '../utils/validation/record-existence.validation.util'
import { EmailService } from './email/email.service'

class NotificationsUseCase {
  constructor (private readonly notificationRepository: NotificationRepository) { }

  public async executeFindAll(
    user: TokenPayload,
    params: PaginatedRequest<NotificationFilters>
  ) {
    const notifications = await this.notificationRepository.findAll(user, params)

    return notifications 
  }

  public async executeFindById (notificationId: string): Promise<Notification | null> {
    const notification = await this.notificationRepository.findById(notificationId)
    RecordExistence.validateRecordExistence(notification, 'Notification')

    return notification
  }

  public async executeDelete (notificationId: string) {
    await this.executeFindById(notificationId)
    const deletedNotification = await this.notificationRepository.delete(notificationId)

    return deletedNotification
  }

  public async executeSendOnAppointmentCreated(appointmentId: string): Promise<void> {
    const appointmentsUseCase = makeAppointmentsUseCaseFactory()
    const appointment = await appointmentsUseCase.executeFindById(appointmentId)
    if (!appointment) return

    const appointmentDateISO = new Date(appointment.appointmentDate).toISOString()

    const serviceName = appointment.offer.service.name
    const customerName = appointment.customer.name
    const recipientId = appointment.offer.professionalId
    const marker = `appointment:${appointment.id}:created:recipient:${recipientId}`

    const professionalMarker = `[Agendamento Criado - PROFISSIONAL - ${appointmentDateISO}]`

    const professionalPreference = appointment.offer.professional.notificationPreference ?? 'NONE'
    const shouldNotifyProfessionalInApp = professionalPreference === 'IN_APP' || professionalPreference === 'BOTH'

    if (shouldNotifyProfessionalInApp) {
      const alreadyExists = await this.notificationRepository.findByMarker(marker)
      if (!alreadyExists) {
        await this.notificationRepository.create({
          appointment: { connect: { id: appointment.id } },
          message: `${professionalMarker} | Novo atendimento de ${serviceName} para ${customerName} em ${appointmentDateISO}.`,
          marker,
          recipientId
        })
      }
    }
  }

  public async executeSendOnAppointmentConfirmed(appointmentId: string): Promise<void> {
    const appointmentsUseCase = makeAppointmentsUseCaseFactory()
    const appointment = await appointmentsUseCase.executeFindById(appointmentId)
    if (!appointment) return

    const appointmentDateISO = new Date(appointment.appointmentDate).toISOString()
    const serviceName = appointment.offer.service.name
    const professionalName = appointment.offer.professional.name ?? 'Profissional'
    const recipientId = appointment.customerId
    const marker = `appointment:${appointment.id}:confirmed:recipient:${recipientId}`

    const customerMarker = `[Agendamento Confirmado - CLIENTE - ${appointmentDateISO}]`
    const customerName = appointment.customer.name ?? 'Cliente'
    const customerEmail = appointment.customer.email

    const preference = appointment.customer.notificationPreference ?? 'NONE'
    const shouldNotifyInApp = preference === 'IN_APP' || preference === 'BOTH'
    const shouldNotifyEmail = preference === 'EMAIL' || preference === 'BOTH'

    const alreadyExists = await this.notificationRepository.findByMarker(marker)

    if (!alreadyExists) {
      if (shouldNotifyInApp) {
        await this.notificationRepository.create({
          appointment: { connect: { id: appointment.id } },
          message: `${customerMarker} | Seu agendamento de ${serviceName} com ${professionalName} foi confirmado para ${appointmentDateISO}.`,
          marker,
          recipientId,
        })
      }

      if (shouldNotifyEmail && customerEmail) {
        const emailService = new EmailService()
        emailService
          .sendAppointmentConfirmed({
            to: customerEmail,
            customerName,
            professionalName,
            serviceName,
            appointmentDateISO,
          })
          .catch(err => console.error('Erro ao enviar e-mail de confirmação:', err?.message || err))
      }
    }
  }

  public async executeSendOnAppointmentCancelled(
    appointmentId: string,
    options: { notifyCustomer: boolean; notifyProfessional: boolean }
  ): Promise<void> {
    const appointmentsUseCase = makeAppointmentsUseCaseFactory()
    const appointment = await appointmentsUseCase.executeFindById(appointmentId)
    if (!appointment) return

    const appointmentDateISO = new Date(appointment.appointmentDate).toISOString()
    const serviceName = appointment.offer.service.name
    const customerName = appointment.customer.name
    const professionalName = appointment.offer.professional.name

    const customerMarker = `[Agendamento Cancelado - CLIENTE - ${appointmentDateISO}]`
    const professionalMarker = `[Agendamento Cancelado - PROFISSIONAL - ${appointmentDateISO}]`

    if (options.notifyCustomer) {
      const recipientId = appointment.customerId
      const marker = `appointment:${appointment.id}:cancelled:recipient:${recipientId}`

      const customerPreference = appointment.customer.notificationPreference ?? 'NONE'
      const shouldNotifyCustomerInApp = customerPreference === 'IN_APP' || customerPreference === 'BOTH'

      if (shouldNotifyCustomerInApp) {
        const alreadyExists = await this.notificationRepository.findByMarker(marker)
        if (!alreadyExists) {
          await this.notificationRepository.create({
            appointment: { connect: { id: appointment.id } },
            message: `${customerMarker} | Seu agendamento de ${serviceName} com ${professionalName} foi cancelado (data original: ${appointmentDateISO}).`,
            marker,
            recipientId
          })
        }
      }
    }

    if (options.notifyProfessional) {
      const recipientId = appointment.offer.professionalId
      const marker = `appointment:${appointment.id}:cancelled:recipient:${recipientId}`

      const professionalPreference = appointment.offer.professional.notificationPreference ?? 'NONE'
      const shouldNotifyProfessionalInApp = professionalPreference === 'IN_APP' || professionalPreference === 'BOTH'

      if (shouldNotifyProfessionalInApp) {
        const alreadyExists = await this.notificationRepository.findByMarker(marker)
        if (!alreadyExists) {
          await this.notificationRepository.create({
            appointment: { connect: { id: appointment.id } },
            message: `${professionalMarker} | Atendimento de ${serviceName} para ${customerName} foi cancelado (data original: ${appointmentDateISO}).`,
            marker,
            recipientId
          })
        }
      }
    }
  }

  public async executeMarkManyAsRead(ids: string[], currentUserId: string) {
    if (ids.length === 0) return { updatedCount: 0 }
    const uniqueIds = [...new Set(ids)]
    const updatedCount = await this.notificationRepository.markManyAsReadForUser(uniqueIds, currentUserId)
    return { updatedCount }
  }

}

export { NotificationsUseCase }
