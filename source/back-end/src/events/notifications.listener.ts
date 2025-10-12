import { notificationBus } from '@/events/notification-bus'
import { enqueue } from '@/events/notification-runner'
import { makeNotificationsUseCaseFactory } from '@/factory/make-notifications-use-case.factory'
import { type TokenPayload } from '@/middlewares/auth/verify-jwt-token.middleware'
import { type FindByIdAppointments } from '@/repository/protocols/appointment.repository'
import { BirthdayNotificationPayload } from '@/services/notifications.use-case'

type CancelledBy = 'CUSTOMER' | 'PROFESSIONAL' | 'MANAGER'

let registered = false
export function registerNotificationListeners () {
  if (registered) return
  registered = true

  notificationBus.on('appointment.confirmed', ({ appointment, userDetails }: { appointment: FindByIdAppointments, userDetails: TokenPayload }) => {
    enqueue(async () => {
      const useCase = makeNotificationsUseCaseFactory()
      await useCase.executeSendOnAppointmentConfirmed(appointment)
    })
  })

  notificationBus.on('appointment.created', ({ appointment, userDetails }: { appointment: FindByIdAppointments, userDetails: TokenPayload }) => {
    enqueue(async () => {
      const useCase = makeNotificationsUseCaseFactory()
      await useCase.executeSendOnAppointmentCreated(appointment)
    })
  })

  notificationBus.on('appointment.cancelled', (
    { appointment, cancelledBy }: { appointment: FindByIdAppointments, userDetails: TokenPayload, cancelledBy: CancelledBy }
  ) => {
    enqueue(async () => {
      const useCase = makeNotificationsUseCaseFactory()
      const notifyCustomer = cancelledBy !== 'CUSTOMER'
      const notifyProfessional = cancelledBy === 'CUSTOMER'
      await useCase.executeSendOnAppointmentCancelled(appointment, { notifyCustomer, notifyProfessional })
    })
  })

  notificationBus.on('birthday.notify', ({ payload }: { payload: BirthdayNotificationPayload }) => {
    enqueue(async () => {
      const useCase = makeNotificationsUseCaseFactory();
      await useCase.executeSendBirthday(payload);
    });
  });

}
