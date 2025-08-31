import { type Notification } from '@prisma/client'
import { type NotificationRepository } from '../repository/protocols/notification.repository'
import { RecordExistence } from '../utils/validation/record-existence.validation.util'

interface NotificationsOutput {
  notifications: Notification[]
}

class NotificationsUseCase {
  constructor(private readonly notificationRepository: NotificationRepository) { }

  public async executeFindAll(): Promise<NotificationsOutput> {
    const notifications = await this.notificationRepository.findAll()
    RecordExistence.validateManyRecordsExistence(notifications, 'notifications')

    return { notifications }
  }

  public async executeFindById(notificationId: string): Promise<Notification | null> {
    const notification = await this.notificationRepository.findById(notificationId)
    RecordExistence.validateRecordExistence(notification, 'Notification')

    return notification
  }

  public async executeFindByUserId(userId: string): Promise<NotificationsOutput> {
    const notifications = await this.notificationRepository.findByUserId(userId)
    RecordExistence.validateManyRecordsExistence(notifications, 'notifications')

    return { notifications }
  }

  public async executeDelete(notificationId: string) {
    await this.executeFindById(notificationId)
    const deletedNotification = await this.notificationRepository.delete(notificationId)

    return deletedNotification
  }

  public async executeMarkAsRead(notificationId: string) {
    const notification = await this.executeFindById(notificationId)
    if (notification?.readAt != null) {
      return notification
    }
    const readNotification = await this.notificationRepository.markAsRead(notificationId)

    return readNotification
  }

  public async sendAppointmentNotification(appointmentId: string) {
    // const appointmentUseCase = makeAppointmentsUseCaseFactory()
    // const appointment = await appointmentUseCase.executeFindById(appointmentId)

    // const customerUseCase = makeCustomersUseCaseFactory()
    // const customer = await customerUseCase.executeFindById(`${appointment?.customerId}`)

    // const appointmentServicesUseCase = makeAppointmentServicesUseCaseFactory()
    // const appointmentServices = await appointmentServicesUseCase.executeFindByAppointmentId(appointmentId)

    // const servicesUseCase = makeServiceUseCaseFactory()
    // const offersUseCase = makeOffersUseCaseFactory()

    // for (const item of appointmentServices.appointmentServices) {
    //   const serviceId = item.serviceId
    //   console.log(item)
    //   const service = await servicesUseCase.executeFindById(serviceId)
    //   const offer = await offersUseCase.executeFindByServiceId(serviceId)
    //   const data = { title: 'Novo agendamento', content: `Cliente: ${customer?.name}, Serviço: ${service?.name}, Dia: ${item.appointmentDate as unknown as string}`, professionalId: `${offer?.professionalId}` }
    //   await this.notificationRepository.create(data)
    // }
  }
}

export { NotificationsUseCase }
