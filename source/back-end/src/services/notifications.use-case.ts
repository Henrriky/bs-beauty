import { TokenPayload } from '@/middlewares/auth/verify-jwt-token.middleware'
import { FindByIdAppointments } from '@/repository/protocols/appointment.repository'
import { NotificationFilters } from '@/types/notifications/notification-filters'
import { PaginatedRequest } from '@/types/pagination'
import { NotificationChannel, NotificationType, UserType, type Notification } from '@prisma/client'
import { type NotificationRepository } from '../repository/protocols/notification.repository'
import { RecordExistence } from '../utils/validation/record-existence.validation.util'
import { EmailService } from './email/email.service'

export type BirthdayNotificationPayload = {
  recipientId: string;
  recipientType: 'CUSTOMER';
  notificationPreference: NotificationChannel;
  email?: string | null;

  marker: string;

  title: string;
  message: string;

  templateKey?: 'BIRTHDAY';
  year?: number;
};

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

  public async executeSendOnAppointmentCreated(appointment: FindByIdAppointments): Promise<void> {
    const appointmentDateISO = new Date(appointment.appointmentDate).toISOString()

    const professionalEmail = appointment.offer.professional.email
    const professionalName = appointment.offer.professional.name ?? 'Profissional'

    const serviceName = appointment.offer.service.name
    const customerName = appointment.customer.name ?? 'Cliente'
    const recipientId = appointment.offer.professionalId
    const marker = `appointment:${appointment.id}:created:recipient:${recipientId}`
    const professionalMarker = `[Agendamento Criado - PROFISSIONAL - ${appointmentDateISO}]`

    const professionalPreference = appointment.offer.professional.notificationPreference ?? 'NONE'
    const shouldNotifyProfessionalInApp = professionalPreference === 'IN_APP' || professionalPreference === 'BOTH'
    const shouldNotifyEmail = professionalPreference === 'EMAIL' || professionalPreference === 'BOTH'

    const alreadyExists = await this.notificationRepository.findByMarker(marker)
    if (!alreadyExists) {

      if (shouldNotifyProfessionalInApp) {
        if (!alreadyExists) {
          await this.notificationRepository.create({
            recipientId,
            marker,
            title: 'Agendamento Criado',
            message: `${professionalMarker} | Novo atendimento de ${serviceName} para ${customerName} em ${appointmentDateISO}.`,
            recipientType: UserType.PROFESSIONAL,
            type: NotificationType.APPOINTMENT
          })
        }
      }

      if (shouldNotifyEmail) {
        const emailService = new EmailService()
        await emailService.sendAppointmentCreated({
          to: professionalEmail,
          professionalName,
          customerName,
          serviceName,
          appointmentDateISO
        })
      }
    }

  }

  public async executeSendOnAppointmentConfirmed(appointment: FindByIdAppointments): Promise<void> {
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
          message: `${customerMarker} | Seu agendamento de ${serviceName} com ${professionalName} foi confirmado para ${appointmentDateISO}.`,
          marker,
          recipientId,
          title: 'Agendamento confirmado',
          recipientType: UserType.CUSTOMER,
          type: NotificationType.APPOINTMENT
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
    appointment: FindByIdAppointments,
    options: { notifyCustomer: boolean; notifyProfessional: boolean }
  ): Promise<void> {
    const appointmentDateISO = new Date(appointment.appointmentDate).toISOString()
    const serviceName = appointment.offer.service.name
    const customerName = appointment.customer.name ?? 'Cliente'
    const customerEmail = appointment.customer.email
    const professionalName = appointment.offer.professional.name ?? 'Profissional'
    const professionalEmail = appointment.offer.professional.email

    const customerMarker = `[Agendamento Cancelado - CLIENTE - ${appointmentDateISO}]`
    const professionalMarker = `[Agendamento Cancelado - PROFISSIONAL - ${appointmentDateISO}]`

    if (options.notifyCustomer) {
      const recipientId = appointment.customerId
      const marker = `appointment:${appointment.id}:cancelled:recipient:${recipientId}`

      const customerPreference = appointment.customer.notificationPreference ?? 'NONE'
      const shouldNotifyCustomerInApp = customerPreference === 'IN_APP' || customerPreference === 'BOTH'
      const shouldNotifyEmail = customerPreference === 'EMAIL' || customerPreference === 'BOTH'

      const alreadyExists = await this.notificationRepository.findByMarker(marker)
      if (!alreadyExists) {
        if (shouldNotifyCustomerInApp) {
          await this.notificationRepository.create({
            recipientId,
            marker,
            title: 'Agendamento cancelado',
            message: `${customerMarker} | Seu agendamento de ${serviceName} com ${professionalName} foi cancelado (data original: ${appointmentDateISO}).`,
            recipientType: UserType.CUSTOMER,
            type: NotificationType.APPOINTMENT
          })
        }

        if (shouldNotifyEmail) {
          const emailService = new EmailService()
          emailService
            .sendAppointmentCancelled({
              to: customerEmail,
              customerName,
              professionalName,
              serviceName,
              appointmentDateISO,
              cancelledBy: 'professional'
            })
            .catch(err => console.error('Erro ao enviar e-mail de confirmação:', err?.message || err))
        }
      }

    }

    if (options.notifyProfessional) {
      const recipientId = appointment.offer.professionalId
      const marker = `appointment:${appointment.id}:cancelled:recipient:${recipientId}`

      const professionalPreference = appointment.offer.professional.notificationPreference ?? 'NONE'

      const alreadyExists = await this.notificationRepository.findByMarker(marker)
      if (!alreadyExists) {
        const shouldNotifyProfessionalInApp = professionalPreference === 'IN_APP' || professionalPreference === 'BOTH'
        const shouldNotifyEmail = professionalPreference === 'EMAIL' || professionalPreference === 'BOTH'

        if (shouldNotifyProfessionalInApp) {
          await this.notificationRepository.create({
            recipientId,
            marker,
            title: 'Agendamento cancelado',
            message: `${professionalMarker} | Atendimento de ${serviceName} para ${customerName} foi cancelado (data original: ${appointmentDateISO}).`,
            recipientType: UserType.PROFESSIONAL,
            type: NotificationType.APPOINTMENT
          })
        }

        if (shouldNotifyEmail) {
          const emailService = new EmailService()
          emailService
            .sendAppointmentCancelled({
              to: professionalEmail,
              customerName,
              professionalName,
              serviceName,
              appointmentDateISO,
              cancelledBy: 'customer'
            })
            .catch(err => console.error('Erro ao enviar e-mail de confirmação:', err?.message || err))
        }

      }
    }
  }

  public async executeSendBirthday(payload: BirthdayNotificationPayload): Promise<void> {
    const {
      recipientId,
      notificationPreference,
      email,
      marker,
      title,
      message,
    } = payload;

    const alreadyExists = await this.notificationRepository.findByMarker(marker);
    if (alreadyExists) return;

    const shouldNotifyInApp =
      notificationPreference === NotificationChannel.IN_APP ||
      notificationPreference === NotificationChannel.BOTH;

    const shouldNotifyEmail =
      notificationPreference === NotificationChannel.EMAIL ||
      notificationPreference === NotificationChannel.BOTH;

    if (shouldNotifyInApp) {
      await this.notificationRepository.create({
        recipientId,
        marker,
        title,
        message,
        recipientType: UserType.CUSTOMER,
        type: NotificationType.SYSTEM
      });
    }

    if (shouldNotifyEmail && email) {
      const emailService = new EmailService();
      await emailService.sendBirthday({
        to: email,
        title,
        message,
        customerName: undefined
      })
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
