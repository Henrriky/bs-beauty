import { notificationBus } from '@/events/notification-bus'
import { enqueue } from '@/events/notification-runner'
import { makeNotificationsUseCaseFactory } from '@/factory/make-notifications-use-case.factory'
import { TokenPayload } from '@/middlewares/auth/verify-jwt-token.middleware'
import { FindByIdAppointments } from '@/repository/protocols/appointment.repository'

type CancelledBy = 'CUSTOMER' | 'PROFESSIONAL' | 'MANAGER'

let registered = false
export function registerNotificationListeners() {
  if (registered) return
  registered = true

  notificationBus.on('appointment.confirmed', ({ appointment, userDetails }: { appointment: FindByIdAppointments, userDetails: TokenPayload }) => {
    enqueue(async () => {
      const useCase = makeNotificationsUseCaseFactory()
      await useCase.executeSendOnAppointmentConfirmed(appointment, userDetails)
    })
  })

  notificationBus.on('appointment.created', ({ appointment, userDetails }: { appointment: FindByIdAppointments, userDetails: TokenPayload }) => {
    enqueue(async () => {
      const useCase = makeNotificationsUseCaseFactory()
      await useCase.executeSendOnAppointmentCreated(appointment, userDetails)
    })
  })

  notificationBus.on('appointment.cancelled', (
    { appointment, userDetails, cancelledBy }: { appointment: FindByIdAppointments; userDetails: TokenPayload, cancelledBy: CancelledBy }
  ) => {
    enqueue(async () => {
      const useCase = makeNotificationsUseCaseFactory()
      const notifyCustomer = cancelledBy !== 'CUSTOMER'
      const notifyProfessional = cancelledBy === 'CUSTOMER'
      await useCase.executeSendOnAppointmentCancelled(appointment, userDetails, { notifyCustomer, notifyProfessional })
    })
  })
}
