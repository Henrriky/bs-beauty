// src/events/notifications.listener.ts
import { notificationBus } from '@/events/notification-bus'
import { makeNotificationsUseCaseFactory } from '@/factory/make-notifications-use-case.factory'
import { enqueue } from '@/events/notification-runner'

type CancelledBy = 'CUSTOMER' | 'PROFESSIONAL' | 'MANAGER'

let registered = false
export function registerNotificationListeners() {
  if (registered) return
  registered = true

  notificationBus.on('appointment.confirmed', ({ appointmentId }: { appointmentId: string }) => {
    enqueue(async () => {
      const useCase = makeNotificationsUseCaseFactory()
      await useCase.executeSendOnAppointmentConfirmed(appointmentId)
    })
  })

  notificationBus.on('appointment.created', ({ appointmentId }: { appointmentId: string }) => {
    enqueue(async () => {
      const useCase = makeNotificationsUseCaseFactory()
      await useCase.executeSendOnAppointmentCreated(appointmentId)
    })
  })

  notificationBus.on('appointment.cancelled', (
    { appointmentId, cancelledBy }: { appointmentId: string; cancelledBy: CancelledBy }
  ) => {
    enqueue(async () => {
      const useCase = makeNotificationsUseCaseFactory()
      const notifyCustomer = cancelledBy !== 'CUSTOMER'
      const notifyProfessional = cancelledBy === 'CUSTOMER'
      await useCase.executeSendOnAppointmentCancelled(appointmentId, { notifyCustomer, notifyProfessional })
    })
  })
}
