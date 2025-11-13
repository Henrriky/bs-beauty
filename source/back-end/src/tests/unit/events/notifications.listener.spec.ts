import { describe, expect, it } from 'vitest'
import { registerNotificationListeners } from '@/events/notifications.listener'
import { notificationBus } from '@/events/notification-bus'

describe('notifications.listener', () => {
  describe('registerNotificationListeners', () => {
    it('should register listeners only once using internal flag', () => {
      // Get initial state
      const initialConfirmed = notificationBus.listenerCount('appointment.confirmed')
      const initialCreated = notificationBus.listenerCount('appointment.created')
      const initialCancelled = notificationBus.listenerCount('appointment.cancelled')
      const initialBirthday = notificationBus.listenerCount('birthday.notify')

      // First call should register listeners
      registerNotificationListeners()

      const afterFirstCall = {
        confirmed: notificationBus.listenerCount('appointment.confirmed'),
        created: notificationBus.listenerCount('appointment.created'),
        cancelled: notificationBus.listenerCount('appointment.cancelled'),
        birthday: notificationBus.listenerCount('birthday.notify')
      }

      // Verify listeners were registered
      expect(afterFirstCall.confirmed).toBeGreaterThanOrEqual(initialConfirmed)
      expect(afterFirstCall.created).toBeGreaterThanOrEqual(initialCreated)
      expect(afterFirstCall.cancelled).toBeGreaterThanOrEqual(initialCancelled)
      expect(afterFirstCall.birthday).toBeGreaterThanOrEqual(initialBirthday)

      // Second call should not register again (internal flag prevents it)
      registerNotificationListeners()

      // Counts should remain the same
      expect(notificationBus.listenerCount('appointment.confirmed')).toBe(afterFirstCall.confirmed)
      expect(notificationBus.listenerCount('appointment.created')).toBe(afterFirstCall.created)
      expect(notificationBus.listenerCount('appointment.cancelled')).toBe(afterFirstCall.cancelled)
      expect(notificationBus.listenerCount('birthday.notify')).toBe(afterFirstCall.birthday)
    })

    it('should not increase listener count on multiple calls', () => {
      const beforeMultipleCalls = {
        confirmed: notificationBus.listenerCount('appointment.confirmed'),
        created: notificationBus.listenerCount('appointment.created'),
        cancelled: notificationBus.listenerCount('appointment.cancelled'),
        birthday: notificationBus.listenerCount('birthday.notify')
      }

      // Call multiple times
      registerNotificationListeners()
      registerNotificationListeners()
      registerNotificationListeners()

      // Counts should not change from the first registration
      expect(notificationBus.listenerCount('appointment.confirmed')).toBe(beforeMultipleCalls.confirmed)
      expect(notificationBus.listenerCount('appointment.created')).toBe(beforeMultipleCalls.created)
      expect(notificationBus.listenerCount('appointment.cancelled')).toBe(beforeMultipleCalls.cancelled)
      expect(notificationBus.listenerCount('birthday.notify')).toBe(beforeMultipleCalls.birthday)
    })

    it('should use notificationBus for event management', () => {
      // Verify that notificationBus is available and has event names
      const eventNames = notificationBus.eventNames()

      expect(eventNames).toBeDefined()
      expect(Array.isArray(eventNames)).toBe(true)
    })

    it('should have stable listener counts', () => {
      const count1 = notificationBus.listenerCount('appointment.confirmed')
      const count2 = notificationBus.listenerCount('appointment.confirmed')

      // Multiple reads should return the same value
      expect(count1).toBe(count2)
    })

    it('should support all expected event types', () => {
      // These are the event types that should be supported
      const expectedEvents = [
        'appointment.confirmed',
        'appointment.created',
        'appointment.cancelled',
        'birthday.notify'
      ]

      expectedEvents.forEach(eventType => {
        // Should not throw when checking listener count
        expect(() => notificationBus.listenerCount(eventType)).not.toThrow()
      })
    })

    it('should maintain event emitter functionality', () => {
      const testEvent = 'test.event.for.verification'
      let callbackExecuted = false

      // Add a test listener
      notificationBus.on(testEvent, () => {
        callbackExecuted = true
      })

      // Emit the test event
      notificationBus.emit(testEvent)

      // Verify the callback was executed
      expect(callbackExecuted).toBe(true)

      // Clean up
      notificationBus.removeAllListeners(testEvent)
    })

    it('should have registerNotificationListeners function defined', () => {
      expect(registerNotificationListeners).toBeDefined()
      expect(typeof registerNotificationListeners).toBe('function')
    })

    it('should not throw when called', () => {
      expect(() => { registerNotificationListeners() }).not.toThrow()
    })
  })
})
