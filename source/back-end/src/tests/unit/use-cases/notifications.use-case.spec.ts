/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { NotificationsUseCase } from '@/services/notifications.use-case'
import { MockNotificationRepository } from '../utils/mocks/repository'
import { faker } from '@faker-js/faker'
import { NotificationType, UserType, type Notification, NotificationChannel } from '@prisma/client'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { TokenPayload } from '@/middlewares/auth/verify-jwt-token.middleware'
import type { FindByIdAppointments } from '@/repository/protocols/appointment.repository'
import { EmailService } from '@/services/email/email.service'
import { DateFormatter } from '@/utils/formatting/date.formatting.util'

vi.mock('@/services/email/email.service')

const createMockUser = (userType: UserType = UserType.CUSTOMER): TokenPayload => ({
  id: faker.string.uuid(),
  userId: faker.string.uuid(),
  sub: faker.string.uuid(),
  userType,
  email: faker.internet.email(),
  name: faker.person.fullName(),
  registerCompleted: true,
  profilePhotoUrl: faker.internet.url(),
  permissions: []
})

const createMockNotification = (overrides: Partial<Notification> = {}): Notification => ({
  id: faker.string.uuid(),
  recipientId: faker.string.uuid(),
  recipientType: UserType.CUSTOMER,
  type: NotificationType.SYSTEM,
  title: faker.lorem.sentence(),
  message: faker.lorem.paragraph(),
  readAt: null,
  marker: faker.string.uuid(),
  createdAt: faker.date.past(),
  ...overrides
})

const createMockPaginationResult = (data: Notification[], page = 1, limit = 10) => ({
  data,
  total: data.length,
  page,
  totalPages: Math.ceil(data.length / limit),
  limit
})

const createMockAppointment = (): FindByIdAppointments => {
  const customerId = faker.string.uuid()
  const professionalId = faker.string.uuid()

  return {
    id: faker.string.uuid(),
    appointmentDate: faker.date.future(),
    customerId,
    customer: {
      id: customerId,
      name: faker.person.fullName(),
      email: faker.internet.email(),
      notificationPreference: 'BOTH'
    },
    offer: {
      id: faker.string.uuid(),
      professionalId,
      professional: {
        id: professionalId,
        name: faker.person.fullName(),
        email: faker.internet.email(),
        notificationPreference: 'BOTH'
      },
      service: {
        id: faker.string.uuid(),
        name: faker.company.name()
      }
    }
  } as unknown as FindByIdAppointments
}

const createMockAppointmentWithPreference = (
  customerPreference: NotificationChannel = NotificationChannel.ALL,
  professionalPreference: NotificationChannel = NotificationChannel.ALL
): FindByIdAppointments => {
  const appointment = createMockAppointment()
  appointment.customer.notificationPreference = customerPreference
  appointment.offer.professional.notificationPreference = professionalPreference
  return appointment
}

const createMockAppointmentWithNullNames = (): FindByIdAppointments => {
  const appointment = createMockAppointment()
    ; (appointment.customer as any).name = null
  ; (appointment.offer.professional as any).name = null
  return appointment
}

const createMockAppointmentWithNullEmail = (): FindByIdAppointments => {
  const appointment = createMockAppointment()
    ; (appointment.customer as any).email = null
  return appointment
}

const createMockBirthdayPayload = (overrides: any = {}) => ({
  recipientId: faker.string.uuid(),
  recipientType: 'CUSTOMER' as const,
  notificationPreference: NotificationChannel.ALL,
  email: faker.internet.email(),
  marker: faker.string.uuid(),
  title: 'Feliz Aniversário!',
  message: 'Desejamos um feliz aniversário!',
  ...overrides
})

describe('NotificationsUseCase (Unit Tests)', () => {
  let notificationsUseCase: NotificationsUseCase

  beforeEach(() => {
    notificationsUseCase = new NotificationsUseCase(MockNotificationRepository)
    vi.clearAllMocks()
  })

  it('should be defined', () => {
    expect(notificationsUseCase).toBeDefined()
  })

  describe('executeFindAll', () => {
    it('should return paginated notifications for a user', async () => {
      // arrange
      const mockUser = createMockUser()
      const mockNotifications = [
        createMockNotification({ recipientId: mockUser.id }),
        createMockNotification({
          recipientId: mockUser.id,
          type: NotificationType.APPOINTMENT,
          readAt: faker.date.past()
        })
      ]
      const mockResult = createMockPaginationResult(mockNotifications)

      const params = {
        page: 1,
        limit: 10,
        filters: {}
      }

      MockNotificationRepository.findAll.mockResolvedValue(mockResult)

      // act
      const result = await notificationsUseCase.executeFindAll(mockUser, params)

      // assert
      expect(result).toEqual(mockResult)
      expect(MockNotificationRepository.findAll).toHaveBeenCalledWith(mockUser, params)
    })

    it('should return paginated notifications with readStatus filter', async () => {
      // arrange
      const mockUser = createMockUser(UserType.PROFESSIONAL)
      const mockUnreadNotifications = [
        createMockNotification({
          recipientId: mockUser.id,
          recipientType: UserType.PROFESSIONAL,
          type: NotificationType.APPOINTMENT
        })
      ]
      const mockResult = createMockPaginationResult(mockUnreadNotifications, 1, 20)

      const params = {
        page: 1,
        limit: 20,
        filters: { readStatus: 'UNREAD' as const }
      }

      MockNotificationRepository.findAll.mockResolvedValue(mockResult)

      // act
      const result = await notificationsUseCase.executeFindAll(mockUser, params)

      // assert
      expect(result).toEqual(mockResult)
      expect(MockNotificationRepository.findAll).toHaveBeenCalledWith(mockUser, params)
    })

    it('should return paginated notifications with read status filter', async () => {
      // arrange
      const mockUser = createMockUser()
      const mockReadNotifications = [
        createMockNotification({
          recipientId: mockUser.id,
          readAt: faker.date.past()
        })
      ]
      const mockResult = createMockPaginationResult(mockReadNotifications)

      const params = {
        page: 1,
        limit: 10,
        filters: { readStatus: 'READ' as const }
      }

      MockNotificationRepository.findAll.mockResolvedValue(mockResult)

      // act
      const result = await notificationsUseCase.executeFindAll(mockUser, params)

      // assert
      expect(result).toEqual(mockResult)
      expect(MockNotificationRepository.findAll).toHaveBeenCalledWith(mockUser, params)
    })

    it('should return empty result when no notifications found', async () => {
      // arrange
      const mockUser = createMockUser()
      const mockEmptyResult = createMockPaginationResult([])

      const params = {
        page: 1,
        limit: 10,
        filters: {}
      }

      MockNotificationRepository.findAll.mockResolvedValue(mockEmptyResult)

      // act
      const result = await notificationsUseCase.executeFindAll(mockUser, params)

      // assert
      expect(result).toEqual(mockEmptyResult)
      expect(MockNotificationRepository.findAll).toHaveBeenCalledWith(mockUser, params)
    })

    it('should handle pagination correctly', async () => {
      // arrange
      const mockUser = createMockUser(UserType.PROFESSIONAL)
      const mockNotifications = [
        createMockNotification({
          recipientId: mockUser.id,
          recipientType: UserType.PROFESSIONAL,
          type: NotificationType.APPOINTMENT
        })
      ]
      const mockResult = {
        data: mockNotifications,
        total: 25,
        page: 3,
        totalPages: 5,
        limit: 5
      }

      const params = {
        page: 3,
        limit: 5,
        filters: {}
      }

      MockNotificationRepository.findAll.mockResolvedValue(mockResult)

      // act
      const result = await notificationsUseCase.executeFindAll(mockUser, params)

      // assert
      expect(result).toEqual(mockResult)
      expect(MockNotificationRepository.findAll).toHaveBeenCalledWith(mockUser, params)
    })

    it('should throw error when repository throws error', async () => {
      // arrange
      const mockUser = createMockUser()
      const params = {
        page: 1,
        limit: 10,
        filters: {}
      }

      const error = new Error('Database connection failed')
      MockNotificationRepository.findAll.mockRejectedValue(error)

      // act & assert
      await expect(
        notificationsUseCase.executeFindAll(mockUser, params)
      ).rejects.toThrow('Database connection failed')

      expect(MockNotificationRepository.findAll).toHaveBeenCalledWith(mockUser, params)
    })

    it('should handle different user types correctly', async () => {
      // arrange
      const mockManagerUser = createMockUser(UserType.MANAGER)
      const mockNotifications = [
        createMockNotification({
          recipientId: mockManagerUser.id,
          recipientType: UserType.MANAGER
        })
      ]
      const mockResult = createMockPaginationResult(mockNotifications)

      const params = {
        page: 1,
        limit: 10,
        filters: {}
      }

      MockNotificationRepository.findAll.mockResolvedValue(mockResult)

      // act
      const result = await notificationsUseCase.executeFindAll(mockManagerUser, params)

      // assert
      expect(result).toEqual(mockResult)
      expect(MockNotificationRepository.findAll).toHaveBeenCalledWith(mockManagerUser, params)
    })
  })

  describe('executeFindById', () => {
    it('should return a notification by id', async () => {
      // arrange
      const notificationId = faker.string.uuid()
      const mockNotification = createMockNotification({ id: notificationId })

      MockNotificationRepository.findById.mockResolvedValue(mockNotification)

      // act
      const result = await notificationsUseCase.executeFindById(notificationId)

      // assert
      expect(result).toEqual(mockNotification)
      expect(MockNotificationRepository.findById).toHaveBeenCalledWith(notificationId)
    })

    it('should return a read notification by id', async () => {
      // arrange
      const notificationId = faker.string.uuid()
      const mockNotification = createMockNotification({
        id: notificationId,
        recipientType: UserType.PROFESSIONAL,
        type: NotificationType.APPOINTMENT,
        readAt: faker.date.past()
      })

      MockNotificationRepository.findById.mockResolvedValue(mockNotification)

      // act
      const result = await notificationsUseCase.executeFindById(notificationId)

      // assert
      expect(result).toEqual(mockNotification)
      expect(MockNotificationRepository.findById).toHaveBeenCalledWith(notificationId)
    })

    it('should throw error when notification is not found', async () => {
      // arrange
      const notificationId = faker.string.uuid()
      MockNotificationRepository.findById.mockResolvedValue(null)

      // act & assert
      await expect(
        notificationsUseCase.executeFindById(notificationId)
      ).rejects.toThrow('Not Found')

      expect(MockNotificationRepository.findById).toHaveBeenCalledWith(notificationId)
    })

    it('should throw error when repository throws error', async () => {
      // arrange
      const notificationId = faker.string.uuid()
      const error = new Error('Database connection failed')
      MockNotificationRepository.findById.mockRejectedValue(error)

      // act & assert
      await expect(
        notificationsUseCase.executeFindById(notificationId)
      ).rejects.toThrow('Database connection failed')

      expect(MockNotificationRepository.findById).toHaveBeenCalledWith(notificationId)
    })

    it('should handle different notification types', async () => {
      // arrange
      const notificationId = faker.string.uuid()
      const mockSystemNotification = createMockNotification({
        id: notificationId,
        recipientType: UserType.MANAGER,
        readAt: faker.date.past()
      })

      MockNotificationRepository.findById.mockResolvedValue(mockSystemNotification)

      // act
      const result = await notificationsUseCase.executeFindById(notificationId)

      // assert
      expect(result).toEqual(mockSystemNotification)
      expect(result).not.toBeNull()
      expect(result!.type).toBe(NotificationType.SYSTEM)
      expect(MockNotificationRepository.findById).toHaveBeenCalledWith(notificationId)
    })
  })

  describe('executeMarkManyAsRead', () => {
    it('should mark multiple notifications as read successfully', async () => {
      // arrange
      const userId = faker.string.uuid()
      const notificationIds = [
        faker.string.uuid(),
        faker.string.uuid(),
        faker.string.uuid()
      ]

      MockNotificationRepository.markManyAsReadForUser.mockResolvedValue(3)

      // act
      const result = await notificationsUseCase.executeMarkManyAsRead(notificationIds, userId)

      // assert
      expect(result).toEqual({ updatedCount: 3 })
      expect(MockNotificationRepository.markManyAsReadForUser).toHaveBeenCalledWith(notificationIds, userId)
    })

    it('should handle empty array of IDs', async () => {
      // arrange
      const userId = faker.string.uuid()
      const notificationIds: string[] = []

      // act
      const result = await notificationsUseCase.executeMarkManyAsRead(notificationIds, userId)

      // assert
      expect(result).toEqual({ updatedCount: 0 })
      expect(MockNotificationRepository.markManyAsReadForUser).not.toHaveBeenCalled()
    })

    it('should handle single notification ID', async () => {
      // arrange
      const userId = faker.string.uuid()
      const notificationIds = [faker.string.uuid()]

      MockNotificationRepository.markManyAsReadForUser.mockResolvedValue(1)

      // act
      const result = await notificationsUseCase.executeMarkManyAsRead(notificationIds, userId)

      // assert
      /* Lines 440-442 omitted */
    })

    it('should handle duplicate IDs by removing duplicates', async () => { /* Lines 445-466 omitted */ })

    it('should handle repository returning partial updates', async () => { /* Lines 469-486 omitted */ })

    it('should handle repository errors', async () => { /* Lines 489-502 omitted */ })

    it('should handle large number of IDs', async () => { /* Lines 505-517 omitted */ })

    it('should handle no notifications updated', async () => { /* Lines 520-533 omitted */ })
  })

  describe('executeDeleteMany', () => {
    it('should delete multiple notifications successfully', async () => {
      // arrange
      const userId = faker.string.uuid()
      const notificationIds = [
        faker.string.uuid(),
        faker.string.uuid(),
        faker.string.uuid()
      ]

      MockNotificationRepository.deleteMany.mockResolvedValue(3)

      // act
      const result = await notificationsUseCase.executeDeleteMany(notificationIds, userId)

      // assert
      expect(result).toEqual({
        success: true,
        message: '3 notifications deleted successfully.'
      })
      expect(MockNotificationRepository.deleteMany).toHaveBeenCalledWith(notificationIds, userId)
    })

    it('should handle empty array of IDs', async () => {
      // arrange
      const userId = faker.string.uuid()
      const notificationIds: string[] = []

      // act
      const result = await notificationsUseCase.executeDeleteMany(notificationIds, userId)

      // assert
      expect(result).toEqual({ deletedCount: 0 })
      expect(MockNotificationRepository.deleteMany).not.toHaveBeenCalled()
    })

    it('should handle single notification ID', async () => {
      // arrange
      const userId = faker.string.uuid()
      const notificationIds = [faker.string.uuid()]

      MockNotificationRepository.deleteMany.mockResolvedValue(1)

      // act
      const result = await notificationsUseCase.executeDeleteMany(notificationIds, userId)

      // assert
      expect(result).toEqual({
        success: true,
        message: '1 notifications deleted successfully.'
      })
      expect(MockNotificationRepository.deleteMany).toHaveBeenCalledWith(notificationIds, userId)
    })

    it('should handle duplicate IDs by removing duplicates', async () => {
      // arrange
      const userId = faker.string.uuid()
      const duplicateId = faker.string.uuid()
      const notificationIds = [duplicateId, duplicateId, faker.string.uuid()]
      const uniqueIds = [duplicateId, notificationIds[2]]

      MockNotificationRepository.deleteMany.mockResolvedValue(2)

      // act
      const result = await notificationsUseCase.executeDeleteMany(notificationIds, userId)

      // assert
      expect(result).toEqual({
        success: true,
        message: '2 notifications deleted successfully.'
      })
      expect(MockNotificationRepository.deleteMany).toHaveBeenCalledWith(uniqueIds, userId)
    })

    it('should handle repository returning partial deletions', async () => {
      // arrange
      const userId = faker.string.uuid()
      const notificationIds = [
        faker.string.uuid(),
        faker.string.uuid(),
        faker.string.uuid()
      ]

      MockNotificationRepository.deleteMany.mockResolvedValue(2)

      // act
      const result = await notificationsUseCase.executeDeleteMany(notificationIds, userId)

      // assert
      expect(result).toEqual({
        success: true,
        message: '2 notifications deleted successfully.'
      })
      expect(MockNotificationRepository.deleteMany).toHaveBeenCalledWith(notificationIds, userId)
    })

    it('should handle repository errors', async () => {
      // arrange
      const userId = faker.string.uuid()
      const notificationIds = [faker.string.uuid(), faker.string.uuid()]
      const error = new Error('Database deletion failed')

      MockNotificationRepository.deleteMany.mockRejectedValue(error)

      // act & assert
      await expect(
        notificationsUseCase.executeDeleteMany(notificationIds, userId)
      ).rejects.toThrow('Database deletion failed')

      expect(MockNotificationRepository.deleteMany).toHaveBeenCalledWith(notificationIds, userId)
    })

    it('should handle large number of IDs', async () => {
      // arrange
      const userId = faker.string.uuid()
      const notificationIds = Array.from({ length: 100 }, () => faker.string.uuid())

      MockNotificationRepository.deleteMany.mockResolvedValue(100)

      // act
      const result = await notificationsUseCase.executeDeleteMany(notificationIds, userId)

      // assert
      expect(result).toEqual({
        success: true,
        message: '100 notifications deleted successfully.'
      })
      expect(MockNotificationRepository.deleteMany).toHaveBeenCalledWith(notificationIds, userId)
    })

    it('should handle no notifications deleted', async () => {
      // arrange
      const userId = faker.string.uuid()
      const notificationIds = [
        faker.string.uuid(),
        faker.string.uuid()
      ]

      MockNotificationRepository.deleteMany.mockResolvedValue(0)

      // act
      const result = await notificationsUseCase.executeDeleteMany(notificationIds, userId)

      // assert
      expect(result).toEqual({
        success: true,
        message: '0 notifications deleted successfully.'
      })
      expect(MockNotificationRepository.deleteMany).toHaveBeenCalledWith(notificationIds, userId)
    })
  })

  describe('executeSendOnAppointmentCreated', () => {
    let mockEmailService: any

    beforeEach(() => {
      mockEmailService = {
        sendAppointmentCreated: vi.fn()
      }
      vi.mocked(EmailService).mockImplementation(() => mockEmailService)
    })

    it('should send in-app and email notifications when professional prefers BOTH', async () => {
      // arrange
      const appointment = createMockAppointmentWithPreference(NotificationChannel.ALL, NotificationChannel.ALL)

      MockNotificationRepository.findByMarker.mockResolvedValue(null)
      MockNotificationRepository.create.mockResolvedValue({} as Notification)
      mockEmailService.sendAppointmentCreated.mockResolvedValue(undefined)

      // act
      await notificationsUseCase.executeSendOnAppointmentCreated(appointment)

      // assert
      const expectedMarker = `appointment:${appointment.id}:created:recipient:${appointment.offer.professionalId}`

      expect(MockNotificationRepository.findByMarker).toHaveBeenCalledWith(expectedMarker)
      expect(MockNotificationRepository.create).toHaveBeenCalledWith({
        recipientId: appointment.offer.professionalId,
        marker: expectedMarker,
        title: expect.stringContaining('Agendamento Criado'),
        message: expect.stringContaining('Novo atendimento'),
        recipientType: UserType.PROFESSIONAL,
        type: NotificationType.APPOINTMENT
      })
      expect(mockEmailService.sendAppointmentCreated).toHaveBeenCalledWith({
        to: appointment.offer.professional.email,
        professionalName: appointment.offer.professional.name,
        customerName: appointment.customer.name,
        serviceName: appointment.offer.service.name,
        appointmentDateISO: appointment.appointmentDate.toISOString()
      })
    })

    it('should send only in-app notification when professional prefers IN_APP', async () => {
      // arrange
      const appointment = createMockAppointmentWithPreference(NotificationChannel.IN_APP, NotificationChannel.IN_APP)

      MockNotificationRepository.findByMarker.mockResolvedValue(null)
      MockNotificationRepository.create.mockResolvedValue({} as Notification)

      // act
      await notificationsUseCase.executeSendOnAppointmentCreated(appointment)

      // assert
      expect(MockNotificationRepository.create).toHaveBeenCalled()
      expect(mockEmailService.sendAppointmentCreated).not.toHaveBeenCalled()
    })

    it('should not send any notification when professional prefers NONE', async () => {
      // arrange
      const appointment = createMockAppointmentWithPreference(NotificationChannel.NONE, NotificationChannel.NONE)

      MockNotificationRepository.findByMarker.mockResolvedValue(null)

      // act
      await notificationsUseCase.executeSendOnAppointmentCreated(appointment)

      // assert
      expect(MockNotificationRepository.create).not.toHaveBeenCalled()
      expect(mockEmailService.sendAppointmentCreated).not.toHaveBeenCalled()
    })

    it('should not send notification if marker already exists', async () => {
      // arrange
      const appointment = createMockAppointment()
      const existingNotification = { id: faker.string.uuid() } as Notification
      MockNotificationRepository.findByMarker.mockResolvedValue(existingNotification)

      // act
      await notificationsUseCase.executeSendOnAppointmentCreated(appointment)

      // assert
      expect(MockNotificationRepository.create).not.toHaveBeenCalled()
      expect(mockEmailService.sendAppointmentCreated).not.toHaveBeenCalled()
    })

    it('should handle null professional name gracefully', async () => {
      // arrange
      const appointment = createMockAppointmentWithNullNames()
      appointment.offer.professional.notificationPreference = NotificationChannel.ALL

      MockNotificationRepository.findByMarker.mockResolvedValue(null)
      MockNotificationRepository.create.mockResolvedValue({} as Notification)
      mockEmailService.sendAppointmentCreated.mockResolvedValue(undefined)

      // act
      await notificationsUseCase.executeSendOnAppointmentCreated(appointment)

      // assert
      expect(mockEmailService.sendAppointmentCreated).toHaveBeenCalledWith({
        to: appointment.offer.professional.email,
        professionalName: 'Profissional',
        customerName: 'Cliente',
        serviceName: appointment.offer.service.name,
        appointmentDateISO: appointment.appointmentDate.toISOString()
      })
    })
  })

  describe('executeSendOnAppointmentConfirmed', () => {
    let mockEmailService: any

    beforeEach(() => {
      mockEmailService = {
        sendAppointmentConfirmed: vi.fn()
      }
      vi.mocked(EmailService).mockImplementation(() => mockEmailService)
    })

    it('should send in-app and email notifications when customer prefers BOTH', async () => {
      // arrange
      const appointment = createMockAppointmentWithPreference(NotificationChannel.ALL, NotificationChannel.ALL)

      MockNotificationRepository.findByMarker.mockResolvedValue(null)
      MockNotificationRepository.create.mockResolvedValue({} as Notification)
      mockEmailService.sendAppointmentConfirmed.mockResolvedValue(undefined)

      // act
      await notificationsUseCase.executeSendOnAppointmentConfirmed(appointment)

      // assert
      const expectedMarker = `appointment:${appointment.id}:confirmed:recipient:${appointment.customerId}`

      expect(MockNotificationRepository.findByMarker).toHaveBeenCalledWith(expectedMarker)
      expect(MockNotificationRepository.create).toHaveBeenCalledWith({
        recipientId: appointment.customerId,
        marker: expectedMarker,
        title: expect.stringContaining('Agendamento confirmado'),
        message: expect.stringContaining('foi confirmado'),
        recipientType: UserType.CUSTOMER,
        type: NotificationType.APPOINTMENT
      })
      expect(mockEmailService.sendAppointmentConfirmed).toHaveBeenCalledWith({
        to: appointment.customer.email,
        customerName: appointment.customer.name,
        professionalName: appointment.offer.professional.name,
        serviceName: appointment.offer.service.name,
        appointmentDateISO: appointment.appointmentDate.toISOString()
      })
    })

    it('should send only in-app notification when customer prefers IN_APP', async () => {
      // arrange
      const appointment = createMockAppointmentWithPreference(NotificationChannel.IN_APP, NotificationChannel.IN_APP)

      MockNotificationRepository.findByMarker.mockResolvedValue(null)
      MockNotificationRepository.create.mockResolvedValue({} as Notification)

      // act
      await notificationsUseCase.executeSendOnAppointmentConfirmed(appointment)

      // assert
      expect(MockNotificationRepository.create).toHaveBeenCalled()
      expect(mockEmailService.sendAppointmentConfirmed).not.toHaveBeenCalled()
    })

    it('should not send any notification when customer prefers NONE', async () => {
      // arrange
      const appointment = createMockAppointmentWithPreference(NotificationChannel.NONE, NotificationChannel.NONE)

      MockNotificationRepository.findByMarker.mockResolvedValue(null)

      // act
      await notificationsUseCase.executeSendOnAppointmentConfirmed(appointment)

      // assert
      expect(MockNotificationRepository.create).not.toHaveBeenCalled()
      expect(mockEmailService.sendAppointmentConfirmed).not.toHaveBeenCalled()
    })

    it('should not send notification if marker already exists', async () => {
      // arrange
      const appointment = createMockAppointment()
      const existingNotification = { id: faker.string.uuid() } as Notification
      MockNotificationRepository.findByMarker.mockResolvedValue(existingNotification)

      // act
      await notificationsUseCase.executeSendOnAppointmentConfirmed(appointment)

      // assert
      expect(MockNotificationRepository.create).not.toHaveBeenCalled()
      expect(mockEmailService.sendAppointmentConfirmed).not.toHaveBeenCalled()
    })

    it('should not send email when customer email is null', async () => {
      // arrange
      const appointment = createMockAppointmentWithNullEmail()
      appointment.customer.notificationPreference = NotificationChannel.ALL

      MockNotificationRepository.findByMarker.mockResolvedValue(null)
      MockNotificationRepository.create.mockResolvedValue({} as Notification)

      // act
      await notificationsUseCase.executeSendOnAppointmentConfirmed(appointment)

      // assert
      expect(MockNotificationRepository.create).toHaveBeenCalled()
      expect(mockEmailService.sendAppointmentConfirmed).not.toHaveBeenCalled()
    })
  })

  describe('executeSendOnAppointmentCancelled', () => {
    let mockEmailService: any

    beforeEach(() => {
      mockEmailService = {
        sendAppointmentCancelled: vi.fn()
      }
      vi.mocked(EmailService).mockImplementation(() => mockEmailService)
    })

    it('should notify customer when notifyCustomer is true', async () => {
      // arrange
      const appointment = createMockAppointmentWithPreference(NotificationChannel.ALL, NotificationChannel.ALL)

      MockNotificationRepository.findByMarker.mockResolvedValue(null)
      MockNotificationRepository.create.mockResolvedValue({} as Notification)
      mockEmailService.sendAppointmentCancelled.mockResolvedValue(undefined)

      // act
      await notificationsUseCase.executeSendOnAppointmentCancelled(appointment, {
        notifyCustomer: true,
        notifyProfessional: false
      })

      // assert
      const expectedCustomerMarker = `appointment:${appointment.id}:cancelled:recipient:${appointment.customerId}`

      expect(MockNotificationRepository.findByMarker).toHaveBeenCalledWith(expectedCustomerMarker)
      expect(MockNotificationRepository.create).toHaveBeenCalledWith({
        recipientId: appointment.customerId,
        marker: expectedCustomerMarker,
        title: expect.stringContaining('Agendamento Cancelado'),
        message: expect.stringContaining('foi cancelado'),
        recipientType: UserType.CUSTOMER,
        type: NotificationType.APPOINTMENT
      })
      expect(mockEmailService.sendAppointmentCancelled).toHaveBeenCalledWith({
        to: appointment.customer.email,
        customerName: appointment.customer.name,
        professionalName: appointment.offer.professional.name,
        serviceName: appointment.offer.service.name,
        appointmentDateISO: appointment.appointmentDate.toISOString(),
        cancelledBy: 'professional'
      })
    })

    it('should notify professional when notifyProfessional is true', async () => {
      // arrange
      const appointment = createMockAppointmentWithPreference(NotificationChannel.ALL, NotificationChannel.ALL)

      MockNotificationRepository.findByMarker.mockResolvedValue(null)
      MockNotificationRepository.create.mockResolvedValue({} as Notification)
      mockEmailService.sendAppointmentCancelled.mockResolvedValue(undefined)

      // act
      await notificationsUseCase.executeSendOnAppointmentCancelled(appointment, {
        notifyCustomer: false,
        notifyProfessional: true
      })

      // assert
      const expectedProfessionalMarker = `appointment:${appointment.id}:cancelled:recipient:${appointment.offer.professionalId}`

      expect(MockNotificationRepository.findByMarker).toHaveBeenCalledWith(expectedProfessionalMarker)
      expect(MockNotificationRepository.create).toHaveBeenCalledWith({
        recipientId: appointment.offer.professionalId,
        marker: expectedProfessionalMarker,
        title: expect.stringContaining('Agendamento Cancelado'),
        message: expect.stringContaining('foi cancelado'),
        recipientType: UserType.PROFESSIONAL,
        type: NotificationType.APPOINTMENT
      })
      expect(mockEmailService.sendAppointmentCancelled).toHaveBeenCalledWith({
        to: appointment.offer.professional.email,
        customerName: appointment.customer.name,
        professionalName: appointment.offer.professional.name,
        serviceName: appointment.offer.service.name,
        appointmentDateISO: appointment.appointmentDate.toISOString(),
        cancelledBy: 'customer'
      })
    })

    it('should not notify anyone when both flags are false', async () => {
      // arrange
      const appointment = createMockAppointment()

      // act
      await notificationsUseCase.executeSendOnAppointmentCancelled(appointment, {
        notifyCustomer: false,
        notifyProfessional: false
      })

      // assert
      expect(MockNotificationRepository.create).not.toHaveBeenCalled()
      expect(mockEmailService.sendAppointmentCancelled).not.toHaveBeenCalled()
    })
  })

  describe('executeSendBirthday', () => {
    let mockEmailService: any

    beforeEach(() => {
      mockEmailService = {
        sendBirthday: vi.fn()
      }
      vi.mocked(EmailService).mockImplementation(() => mockEmailService)
    })

    it('should send in-app and email notifications when preference is BOTH', async () => {
      // arrange
      const payload = createMockBirthdayPayload({
        templateKey: 'BIRTHDAY' as const,
        year: 2024
      })

      MockNotificationRepository.findByMarker.mockResolvedValue(null)
      MockNotificationRepository.create.mockResolvedValue({} as Notification)
      mockEmailService.sendBirthday.mockResolvedValue(undefined)

      // act
      await notificationsUseCase.executeSendBirthday(payload)

      // assert
      expect(MockNotificationRepository.findByMarker).toHaveBeenCalledWith(payload.marker)
      expect(MockNotificationRepository.create).toHaveBeenCalledWith({
        recipientId: payload.recipientId,
        marker: payload.marker,
        title: payload.title,
        message: payload.message,
        recipientType: UserType.CUSTOMER,
        type: NotificationType.SYSTEM
      })
      expect(mockEmailService.sendBirthday).toHaveBeenCalledWith({
        to: payload.email,
        title: payload.title,
        message: payload.message,
        customerName: undefined
      })
    })

    it('should send only in-app notification when preference is IN_APP', async () => {
      // arrange
      const payload = createMockBirthdayPayload({
        notificationPreference: NotificationChannel.IN_APP
      })

      MockNotificationRepository.findByMarker.mockResolvedValue(null)
      MockNotificationRepository.create.mockResolvedValue({} as Notification)

      // act
      await notificationsUseCase.executeSendBirthday(payload)

      // assert
      expect(MockNotificationRepository.create).toHaveBeenCalledWith({
        recipientId: payload.recipientId,
        marker: payload.marker,
        title: payload.title,
        message: payload.message,
        recipientType: UserType.CUSTOMER,
        type: NotificationType.SYSTEM
      })
      expect(mockEmailService.sendBirthday).not.toHaveBeenCalled()
    })

    it('should not send notification if marker already exists', async () => {
      // arrange
      const payload = createMockBirthdayPayload()
      const existingNotification = { id: faker.string.uuid() } as Notification
      MockNotificationRepository.findByMarker.mockResolvedValue(existingNotification)

      // act
      await notificationsUseCase.executeSendBirthday(payload)

      // assert
      expect(MockNotificationRepository.create).not.toHaveBeenCalled()
      expect(mockEmailService.sendBirthday).not.toHaveBeenCalled()
    })

    it('should not send email when email is null', async () => {
      // arrange
      const payload = createMockBirthdayPayload({
        email: null
      })

      MockNotificationRepository.findByMarker.mockResolvedValue(null)
      MockNotificationRepository.create.mockResolvedValue({} as Notification)

      // act
      await notificationsUseCase.executeSendBirthday(payload)

      // assert
      expect(MockNotificationRepository.create).toHaveBeenCalled()
      expect(mockEmailService.sendBirthday).not.toHaveBeenCalled()
    })

    it('should not send any notification when preference is NONE', async () => {
      // arrange
      const payload = createMockBirthdayPayload({
        notificationPreference: NotificationChannel.NONE
      })

      MockNotificationRepository.findByMarker.mockResolvedValue(null)

      // act
      await notificationsUseCase.executeSendBirthday(payload)

      // assert
      expect(MockNotificationRepository.create).not.toHaveBeenCalled()
      expect(mockEmailService.sendBirthday).not.toHaveBeenCalled()
    })
  })
})
