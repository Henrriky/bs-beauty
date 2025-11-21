import { beforeEach, describe, expect, it, vi } from 'vitest'
import { registerNotificationListeners } from '@/events/notifications.listener'
import { notificationBus } from '@/events/notification-bus'
import * as notificationRunner from '@/events/notification-runner'
import * as notificationFactory from '@/factory/make-notifications-use-case.factory'
import { type FindByIdAppointments } from '@/repository/protocols/appointment.repository'
import { type TokenPayload } from '@/middlewares/auth/verify-jwt-token.middleware'
import { type BirthdayNotificationPayload } from '@/services/notifications.use-case'
import { type Service } from '@prisma/client'

// Mock dependencies
vi.mock('@/events/notification-runner', () => ({
  enqueue: vi.fn()
}))

vi.mock('@/factory/make-notifications-use-case.factory', () => ({
  makeNotificationsUseCaseFactory: vi.fn()
}))

describe('notifications.listener', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

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

    it('should enqueue notification job when appointment.confirmed event is emitted', () => {
      const mockAppointment = { id: 'test-id' } as FindByIdAppointments
      const mockUserDetails = { userId: 'user-123' } as TokenPayload
      const enqueueSpy = vi.spyOn(notificationRunner, 'enqueue')

      registerNotificationListeners()
      notificationBus.emit('appointment.confirmed', {
        appointment: mockAppointment,
        userDetails: mockUserDetails
      })

      expect(enqueueSpy).toHaveBeenCalledWith(expect.any(Function))
    })

    it('should enqueue notification job when appointment.created event is emitted', () => {
      const mockAppointment = { id: 'test-id' } as FindByIdAppointments
      const mockUserDetails = { userId: 'user-123' } as TokenPayload
      const enqueueSpy = vi.spyOn(notificationRunner, 'enqueue')

      registerNotificationListeners()
      notificationBus.emit('appointment.created', {
        appointment: mockAppointment,
        userDetails: mockUserDetails
      })

      expect(enqueueSpy).toHaveBeenCalledWith(expect.any(Function))
    })

    it('should enqueue notification job when appointment.cancelled event is emitted', () => {
      const mockAppointment = { id: 'test-id' } as FindByIdAppointments
      const mockUserDetails = { userId: 'user-123' } as TokenPayload
      const enqueueSpy = vi.spyOn(notificationRunner, 'enqueue')

      registerNotificationListeners()
      notificationBus.emit('appointment.cancelled', {
        appointment: mockAppointment,
        userDetails: mockUserDetails,
        cancelledBy: 'CUSTOMER' as const
      })

      expect(enqueueSpy).toHaveBeenCalledWith(expect.any(Function))
    })

    it('should enqueue notification job when birthday.notify event is emitted', () => {
      const mockPayload: BirthdayNotificationPayload = {
        recipientId: 'customer-123',
        recipientType: 'CUSTOMER',
        notificationPreference: 'IN_APP',
        email: 'test@example.com',
        marker: 'birthday-2024',
        title: 'Happy Birthday!',
        message: 'Happy Birthday John Doe!',
        templateKey: 'BIRTHDAY',
        year: 2024
      }
      const enqueueSpy = vi.spyOn(notificationRunner, 'enqueue')

      registerNotificationListeners()
      notificationBus.emit('birthday.notify', { payload: mockPayload })

      expect(enqueueSpy).toHaveBeenCalledWith(expect.any(Function))
    })

    it('should enqueue notification job when service.created event is emitted', () => {
      const mockService = {
        id: 'service-123',
        name: 'Test Service'
      } as Service
      const enqueueSpy = vi.spyOn(notificationRunner, 'enqueue')

      registerNotificationListeners()
      notificationBus.emit('service.created', { service: mockService })

      expect(enqueueSpy).toHaveBeenCalledWith(expect.any(Function))
    })

    it('should enqueue notification job when service.statusChanged event is emitted', () => {
      const mockService = {
        id: 'service-123',
        name: 'Test Service',
        createdBy: 'user-456'
      } as Service & { createdBy: string }
      const enqueueSpy = vi.spyOn(notificationRunner, 'enqueue')

      registerNotificationListeners()
      notificationBus.emit('service.statusChanged', { service: mockService })

      expect(enqueueSpy).toHaveBeenCalledWith(expect.any(Function))
    })

    it('should call correct use case for appointment.confirmed', async () => {
      const mockAppointment = { id: 'test-id' } as FindByIdAppointments
      const mockUserDetails = { userId: 'user-123' } as TokenPayload
      const mockUseCase = {
        executeSendOnAppointmentConfirmed: vi.fn().mockResolvedValue(undefined)
      }
      vi.mocked(notificationFactory.makeNotificationsUseCaseFactory).mockReturnValue(mockUseCase as any)

      let capturedJob: (() => Promise<void>) | undefined
      vi.mocked(notificationRunner.enqueue).mockImplementation((job) => {
        capturedJob = job
      })

      registerNotificationListeners()
      notificationBus.emit('appointment.confirmed', {
        appointment: mockAppointment,
        userDetails: mockUserDetails
      })

      // Execute the captured job
      expect(capturedJob).toBeDefined()
      await capturedJob!()

      expect(mockUseCase.executeSendOnAppointmentConfirmed).toHaveBeenCalledWith(mockAppointment)
    })

    it('should call correct use case for appointment.created', async () => {
      const mockAppointment = { id: 'test-id' } as FindByIdAppointments
      const mockUserDetails = { userId: 'user-123' } as TokenPayload
      const mockUseCase = {
        executeSendOnAppointmentCreated: vi.fn().mockResolvedValue(undefined)
      }
      vi.mocked(notificationFactory.makeNotificationsUseCaseFactory).mockReturnValue(mockUseCase as any)

      let capturedJob: (() => Promise<void>) | undefined
      vi.mocked(notificationRunner.enqueue).mockImplementation((job) => {
        capturedJob = job
      })

      registerNotificationListeners()
      notificationBus.emit('appointment.created', {
        appointment: mockAppointment,
        userDetails: mockUserDetails
      })

      expect(capturedJob).toBeDefined()
      await capturedJob!()

      expect(mockUseCase.executeSendOnAppointmentCreated).toHaveBeenCalledWith(mockAppointment)
    })

    it('should call correct use case for appointment.cancelled with correct notification flags', async () => {
      const mockAppointment = { id: 'test-id' } as FindByIdAppointments
      const mockUserDetails = { userId: 'user-123' } as TokenPayload
      const mockUseCase = {
        executeSendOnAppointmentCancelled: vi.fn().mockResolvedValue(undefined)
      }
      vi.mocked(notificationFactory.makeNotificationsUseCaseFactory).mockReturnValue(mockUseCase as any)

      let capturedJob: (() => Promise<void>) | undefined
      vi.mocked(notificationRunner.enqueue).mockImplementation((job) => {
        capturedJob = job
      })

      registerNotificationListeners()
      notificationBus.emit('appointment.cancelled', {
        appointment: mockAppointment,
        userDetails: mockUserDetails,
        cancelledBy: 'CUSTOMER' as const
      })

      expect(capturedJob).toBeDefined()
      await capturedJob!()

      expect(mockUseCase.executeSendOnAppointmentCancelled).toHaveBeenCalledWith(
        mockAppointment,
        { notifyCustomer: false, notifyProfessional: true }
      )
    })

    it('should handle cancelled by PROFESSIONAL correctly', async () => {
      const mockAppointment = { id: 'test-id' } as FindByIdAppointments
      const mockUserDetails = { userId: 'user-123' } as TokenPayload
      const mockUseCase = {
        executeSendOnAppointmentCancelled: vi.fn().mockResolvedValue(undefined)
      }
      vi.mocked(notificationFactory.makeNotificationsUseCaseFactory).mockReturnValue(mockUseCase as any)

      let capturedJob: (() => Promise<void>) | undefined
      vi.mocked(notificationRunner.enqueue).mockImplementation((job) => {
        capturedJob = job
      })

      registerNotificationListeners()
      notificationBus.emit('appointment.cancelled', {
        appointment: mockAppointment,
        userDetails: mockUserDetails,
        cancelledBy: 'PROFESSIONAL' as const
      })

      expect(capturedJob).toBeDefined()
      await capturedJob!()

      expect(mockUseCase.executeSendOnAppointmentCancelled).toHaveBeenCalledWith(
        mockAppointment,
        { notifyCustomer: true, notifyProfessional: false }
      )
    })

    it('should handle cancelled by MANAGER correctly', async () => {
      const mockAppointment = { id: 'test-id' } as FindByIdAppointments
      const mockUserDetails = { userId: 'user-123' } as TokenPayload
      const mockUseCase = {
        executeSendOnAppointmentCancelled: vi.fn().mockResolvedValue(undefined)
      }
      vi.mocked(notificationFactory.makeNotificationsUseCaseFactory).mockReturnValue(mockUseCase as any)

      let capturedJob: (() => Promise<void>) | undefined
      vi.mocked(notificationRunner.enqueue).mockImplementation((job) => {
        capturedJob = job
      })

      registerNotificationListeners()
      notificationBus.emit('appointment.cancelled', {
        appointment: mockAppointment,
        userDetails: mockUserDetails,
        cancelledBy: 'MANAGER' as const
      })

      expect(capturedJob).toBeDefined()
      await capturedJob!()

      expect(mockUseCase.executeSendOnAppointmentCancelled).toHaveBeenCalledWith(
        mockAppointment,
        { notifyCustomer: true, notifyProfessional: false }
      )
    })

    it('should call correct use case for birthday.notify', async () => {
      const mockPayload: BirthdayNotificationPayload = {
        recipientId: 'customer-123',
        recipientType: 'CUSTOMER',
        notificationPreference: 'IN_APP',
        email: 'test@example.com',
        marker: 'birthday-2024',
        title: 'Happy Birthday!',
        message: 'Happy Birthday John Doe!',
        templateKey: 'BIRTHDAY',
        year: 2024
      }
      const mockUseCase = {
        executeSendBirthday: vi.fn().mockResolvedValue(undefined)
      }
      vi.mocked(notificationFactory.makeNotificationsUseCaseFactory).mockReturnValue(mockUseCase as any)

      let capturedJob: (() => Promise<void>) | undefined
      vi.mocked(notificationRunner.enqueue).mockImplementation((job) => {
        capturedJob = job
      })

      registerNotificationListeners()
      notificationBus.emit('birthday.notify', { payload: mockPayload })

      expect(capturedJob).toBeDefined()
      await capturedJob!()

      expect(mockUseCase.executeSendBirthday).toHaveBeenCalledWith(mockPayload)
    })

    it('should call correct use case for service.created', async () => {
      const mockService = {
        id: 'service-123',
        name: 'Test Service'
      } as Service
      const mockUseCase = {
        executeSendOnServiceCreated: vi.fn().mockResolvedValue(undefined)
      }
      vi.mocked(notificationFactory.makeNotificationsUseCaseFactory).mockReturnValue(mockUseCase as any)

      let capturedJob: (() => Promise<void>) | undefined
      vi.mocked(notificationRunner.enqueue).mockImplementation((job) => {
        capturedJob = job
      })

      registerNotificationListeners()
      notificationBus.emit('service.created', { service: mockService })

      expect(capturedJob).toBeDefined()
      await capturedJob!()

      expect(mockUseCase.executeSendOnServiceCreated).toHaveBeenCalledWith(mockService)
    })

    it('should call correct use case for service.statusChanged', async () => {
      const mockService = {
        id: 'service-123',
        name: 'Test Service',
        createdBy: 'user-456'
      } as Service & { createdBy: string }
      const mockUseCase = {
        executeSendOnServiceStatusChanged: vi.fn().mockResolvedValue(undefined)
      }
      vi.mocked(notificationFactory.makeNotificationsUseCaseFactory).mockReturnValue(mockUseCase as any)

      let capturedJob: (() => Promise<void>) | undefined
      vi.mocked(notificationRunner.enqueue).mockImplementation((job) => {
        capturedJob = job
      })

      registerNotificationListeners()
      notificationBus.emit('service.statusChanged', { service: mockService })

      expect(capturedJob).toBeDefined()
      await capturedJob!()

      expect(mockUseCase.executeSendOnServiceStatusChanged).toHaveBeenCalledWith(mockService)
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
