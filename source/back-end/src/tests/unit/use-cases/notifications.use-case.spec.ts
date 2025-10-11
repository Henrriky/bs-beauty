import { NotificationsUseCase } from '@/services/notifications.use-case'
import { MockNotificationRepository } from '../utils/mocks/repository'
import { faker } from '@faker-js/faker'
import { NotificationType, UserType, type Notification, NotificationChannel } from '@prisma/client'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { TokenPayload } from '@/middlewares/auth/verify-jwt-token.middleware'
import type { FindByIdAppointments } from '@/repository/protocols/appointment.repository'
import { EmailService } from '@/services/email/email.service'

vi.mock('@/services/email/email.service')

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
      const mockUser: TokenPayload = {
        id: faker.string.uuid(),
        userId: faker.string.uuid(),
        sub: faker.string.uuid(),
        userType: UserType.CUSTOMER,
        email: faker.internet.email(),
        name: faker.person.fullName(),
        registerCompleted: true,
        profilePhotoUrl: faker.internet.url(),
        permissions: []
      }

      const mockNotifications: Notification[] = [
        {
          id: faker.string.uuid(),
          recipientId: mockUser.id,
          recipientType: UserType.CUSTOMER,
          type: NotificationType.SYSTEM,
          title: faker.lorem.sentence(),
          message: faker.lorem.paragraph(),
          readAt: null,
          marker: faker.string.uuid(),
          createdAt: faker.date.past()
        },
        {
          id: faker.string.uuid(),
          recipientId: mockUser.id,
          recipientType: UserType.CUSTOMER,
          type: NotificationType.APPOINTMENT,
          title: faker.lorem.sentence(),
          message: faker.lorem.paragraph(),
          readAt: faker.date.past(),
          marker: faker.string.uuid(),
          createdAt: faker.date.past()
        }
      ]

      const mockResult = {
        data: mockNotifications,
        total: 2,
        page: 1,
        totalPages: 1,
        limit: 10
      }

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
      const mockUser: TokenPayload = {
        id: faker.string.uuid(),
        userId: faker.string.uuid(),
        sub: faker.string.uuid(),
        userType: UserType.PROFESSIONAL,
        email: faker.internet.email(),
        name: faker.person.fullName(),
        registerCompleted: true,
        profilePhotoUrl: faker.internet.url(),
        permissions: []
      }

      const mockUnreadNotifications: Notification[] = [
        {
          id: faker.string.uuid(),
          recipientId: mockUser.id,
          recipientType: UserType.PROFESSIONAL,
          type: NotificationType.APPOINTMENT,
          title: faker.lorem.sentence(),
          message: faker.lorem.paragraph(),
          readAt: null,
          marker: faker.string.uuid(),
          createdAt: faker.date.past()
        }
      ]

      const mockResult = {
        data: mockUnreadNotifications,
        total: 1,
        page: 1,
        totalPages: 1,
        limit: 20
      }

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
      const mockUser: TokenPayload = {
        id: faker.string.uuid(),
        userId: faker.string.uuid(),
        sub: faker.string.uuid(),
        userType: UserType.CUSTOMER,
        email: faker.internet.email(),
        name: faker.person.fullName(),
        registerCompleted: true,
        profilePhotoUrl: faker.internet.url(),
        permissions: []
      }

      const mockReadNotifications: Notification[] = [
        {
          id: faker.string.uuid(),
          recipientId: mockUser.id,
          recipientType: UserType.CUSTOMER,
          type: NotificationType.SYSTEM,
          title: faker.lorem.sentence(),
          message: faker.lorem.paragraph(),
          readAt: faker.date.past(),
          marker: faker.string.uuid(),
          createdAt: faker.date.past()
        }
      ]

      const mockResult = {
        data: mockReadNotifications,
        total: 1,
        page: 1,
        totalPages: 1,
        limit: 10
      }

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
      const mockUser: TokenPayload = {
        id: faker.string.uuid(),
        userId: faker.string.uuid(),
        sub: faker.string.uuid(),
        userType: UserType.CUSTOMER,
        email: faker.internet.email(),
        name: faker.person.fullName(),
        registerCompleted: true,
        profilePhotoUrl: faker.internet.url(),
        permissions: []
      }

      const mockEmptyResult = {
        data: [],
        total: 0,
        page: 1,
        totalPages: 0,
        limit: 10
      }

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
      const mockUser: TokenPayload = {
        id: faker.string.uuid(),
        userId: faker.string.uuid(),
        sub: faker.string.uuid(),
        userType: UserType.PROFESSIONAL,
        email: faker.internet.email(),
        name: faker.person.fullName(),
        registerCompleted: true,
        profilePhotoUrl: faker.internet.url(),
        permissions: []
      }

      const mockNotifications: Notification[] = [
        {
          id: faker.string.uuid(),
          recipientId: mockUser.id,
          recipientType: UserType.PROFESSIONAL,
          type: NotificationType.APPOINTMENT,
          title: faker.lorem.sentence(),
          message: faker.lorem.paragraph(),
          readAt: null,
          marker: faker.string.uuid(),
          createdAt: faker.date.past()
        }
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
      const mockUser: TokenPayload = {
        id: faker.string.uuid(),
        userId: faker.string.uuid(),
        sub: faker.string.uuid(),
        userType: UserType.CUSTOMER,
        email: faker.internet.email(),
        name: faker.person.fullName(),
        registerCompleted: true,
        profilePhotoUrl: faker.internet.url(),
        permissions: []
      }

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
      const mockManagerUser: TokenPayload = {
        id: faker.string.uuid(),
        userId: faker.string.uuid(),
        sub: faker.string.uuid(),
        userType: UserType.MANAGER,
        email: faker.internet.email(),
        name: faker.person.fullName(),
        registerCompleted: true,
        profilePhotoUrl: faker.internet.url(),
        permissions: []
      }

      const mockNotifications: Notification[] = [
        {
          id: faker.string.uuid(),
          recipientId: mockManagerUser.id,
          recipientType: UserType.MANAGER,
          type: NotificationType.SYSTEM,
          title: faker.lorem.sentence(),
          message: faker.lorem.paragraph(),
          readAt: null,
          marker: faker.string.uuid(),
          createdAt: faker.date.past()
        }
      ]

      const mockResult = {
        data: mockNotifications,
        total: 1,
        page: 1,
        totalPages: 1,
        limit: 10
      }

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
      const mockNotification: Notification = {
        id: notificationId,
        recipientId: faker.string.uuid(),
        recipientType: UserType.CUSTOMER,
        type: NotificationType.SYSTEM,
        title: faker.lorem.sentence(),
        message: faker.lorem.paragraph(),
        readAt: null,
        marker: faker.string.uuid(),
        createdAt: faker.date.past()
      }

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
      const mockNotification: Notification = {
        id: notificationId,
        recipientId: faker.string.uuid(),
        recipientType: UserType.PROFESSIONAL,
        type: NotificationType.APPOINTMENT,
        title: faker.lorem.sentence(),
        message: faker.lorem.paragraph(),
        readAt: faker.date.past(),
        marker: faker.string.uuid(),
        createdAt: faker.date.past()
      }

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
      const mockSystemNotification: Notification = {
        id: notificationId,
        recipientId: faker.string.uuid(),
        recipientType: UserType.MANAGER,
        type: NotificationType.SYSTEM,
        title: faker.lorem.sentence(),
        message: faker.lorem.paragraph(),
        readAt: faker.date.past(),
        marker: faker.string.uuid(),
        createdAt: faker.date.past()
      }

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

  describe('executeDelete', () => {
    it('should delete a notification successfully', async () => {
      // arrange
      const notificationId = faker.string.uuid()
      const mockNotification: Notification = {
        id: notificationId,
        recipientId: faker.string.uuid(),
        recipientType: UserType.CUSTOMER,
        type: NotificationType.SYSTEM,
        title: faker.lorem.sentence(),
        message: faker.lorem.paragraph(),
        readAt: null,
        marker: faker.string.uuid(),
        createdAt: faker.date.past()
      }

      const deletedNotification: Notification = { ...mockNotification }

      MockNotificationRepository.findById.mockResolvedValue(mockNotification)
      MockNotificationRepository.delete.mockResolvedValue(deletedNotification)

      // act
      const result = await notificationsUseCase.executeDelete(notificationId)

      // assert
      expect(result).toEqual(deletedNotification)
      expect(MockNotificationRepository.findById).toHaveBeenCalledWith(notificationId)
      expect(MockNotificationRepository.delete).toHaveBeenCalledWith(notificationId)
    })

    it('should delete a read notification successfully', async () => {
      // arrange
      const notificationId = faker.string.uuid()
      const mockNotification: Notification = {
        id: notificationId,
        recipientId: faker.string.uuid(),
        recipientType: UserType.PROFESSIONAL,
        type: NotificationType.APPOINTMENT,
        title: faker.lorem.sentence(),
        message: faker.lorem.paragraph(),
        readAt: faker.date.past(),
        marker: faker.string.uuid(),
        createdAt: faker.date.past()
      }

      const deletedNotification: Notification = { ...mockNotification }

      MockNotificationRepository.findById.mockResolvedValue(mockNotification)
      MockNotificationRepository.delete.mockResolvedValue(deletedNotification)

      // act
      const result = await notificationsUseCase.executeDelete(notificationId)

      // assert
      expect(result).toEqual(deletedNotification)
      expect(MockNotificationRepository.findById).toHaveBeenCalledWith(notificationId)
      expect(MockNotificationRepository.delete).toHaveBeenCalledWith(notificationId)
    })

    it('should throw error when notification is not found before deletion', async () => {
      // arrange
      const notificationId = faker.string.uuid()
      MockNotificationRepository.findById.mockResolvedValue(null)

      // act & assert
      await expect(
        notificationsUseCase.executeDelete(notificationId)
      ).rejects.toThrow('Not Found')

      expect(MockNotificationRepository.findById).toHaveBeenCalledWith(notificationId)
      expect(MockNotificationRepository.delete).not.toHaveBeenCalled()
    })

    it('should handle repository error during deletion', async () => {
      // arrange
      const notificationId = faker.string.uuid()
      const mockNotification: Notification = {
        id: notificationId,
        recipientId: faker.string.uuid(),
        recipientType: UserType.CUSTOMER,
        type: NotificationType.SYSTEM,
        title: faker.lorem.sentence(),
        message: faker.lorem.paragraph(),
        readAt: null,
        marker: faker.string.uuid(),
        createdAt: faker.date.past()
      }

      const error = new Error('Database deletion failed')

      MockNotificationRepository.findById.mockResolvedValue(mockNotification)
      MockNotificationRepository.delete.mockRejectedValue(error)

      // act & assert
      await expect(
        notificationsUseCase.executeDelete(notificationId)
      ).rejects.toThrow('Database deletion failed')

      expect(MockNotificationRepository.findById).toHaveBeenCalledWith(notificationId)
      expect(MockNotificationRepository.delete).toHaveBeenCalledWith(notificationId)
    })

    it('should handle repository error during findById', async () => {
      // arrange
      const notificationId = faker.string.uuid()
      const error = new Error('Database connection failed')

      MockNotificationRepository.findById.mockRejectedValue(error)

      // act & assert
      await expect(
        notificationsUseCase.executeDelete(notificationId)
      ).rejects.toThrow('Database connection failed')

      expect(MockNotificationRepository.findById).toHaveBeenCalledWith(notificationId)
      expect(MockNotificationRepository.delete).not.toHaveBeenCalled()
    })

    it('should delete different notification types', async () => {
      // arrange
      const notificationId = faker.string.uuid()
      const mockSystemNotification: Notification = {
        id: notificationId,
        recipientId: faker.string.uuid(),
        recipientType: UserType.MANAGER,
        type: NotificationType.SYSTEM,
        title: faker.lorem.sentence(),
        message: faker.lorem.paragraph(),
        readAt: faker.date.past(),
        marker: faker.string.uuid(),
        createdAt: faker.date.past()
      }

      const deletedNotification: Notification = { ...mockSystemNotification }

      MockNotificationRepository.findById.mockResolvedValue(mockSystemNotification)
      MockNotificationRepository.delete.mockResolvedValue(deletedNotification)

      // act
      const result = await notificationsUseCase.executeDelete(notificationId)

      // assert
      expect(result).toEqual(deletedNotification)
      expect(result.type).toBe(NotificationType.SYSTEM)
      expect(MockNotificationRepository.findById).toHaveBeenCalledWith(notificationId)
      expect(MockNotificationRepository.delete).toHaveBeenCalledWith(notificationId)
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
      expect(result).toEqual({ updatedCount: 1 })
      expect(MockNotificationRepository.markManyAsReadForUser).toHaveBeenCalledWith(notificationIds, userId)
    })

    it('should handle duplicate IDs by removing duplicates', async () => {
      // arrange
      const userId = faker.string.uuid()
      const duplicateId = faker.string.uuid()
      const notificationIds = [
        duplicateId,
        faker.string.uuid(),
        duplicateId, // duplicate
        faker.string.uuid()
      ]

      // Expected unique IDs (3 unique from 4 total)
      const expectedUniqueIds = [duplicateId, notificationIds[1], notificationIds[3]]

      MockNotificationRepository.markManyAsReadForUser.mockResolvedValue(3)

      // act
      const result = await notificationsUseCase.executeMarkManyAsRead(notificationIds, userId)

      // assert
      expect(result).toEqual({ updatedCount: 3 })
      expect(MockNotificationRepository.markManyAsReadForUser).toHaveBeenCalledWith(expectedUniqueIds, userId)
    })

    it('should handle repository returning partial updates', async () => {
      // arrange
      const userId = faker.string.uuid()
      const notificationIds = [
        faker.string.uuid(),
        faker.string.uuid(),
        faker.string.uuid()
      ]

      // Repository returns 2 (maybe 1 was already read or didn't belong to user)
      MockNotificationRepository.markManyAsReadForUser.mockResolvedValue(2)

      // act
      const result = await notificationsUseCase.executeMarkManyAsRead(notificationIds, userId)

      // assert
      expect(result).toEqual({ updatedCount: 2 })
      expect(MockNotificationRepository.markManyAsReadForUser).toHaveBeenCalledWith(notificationIds, userId)
    })

    it('should handle repository errors', async () => {
      // arrange
      const userId = faker.string.uuid()
      const notificationIds = [faker.string.uuid(), faker.string.uuid()]
      const error = new Error('Database update failed')

      MockNotificationRepository.markManyAsReadForUser.mockRejectedValue(error)

      // act & assert
      await expect(
        notificationsUseCase.executeMarkManyAsRead(notificationIds, userId)
      ).rejects.toThrow('Database update failed')

      expect(MockNotificationRepository.markManyAsReadForUser).toHaveBeenCalledWith(notificationIds, userId)
    })

    it('should handle large number of IDs', async () => {
      // arrange
      const userId = faker.string.uuid()
      const notificationIds = Array.from({ length: 1000 }, () => faker.string.uuid())

      MockNotificationRepository.markManyAsReadForUser.mockResolvedValue(1000)

      // act
      const result = await notificationsUseCase.executeMarkManyAsRead(notificationIds, userId)

      // assert
      expect(result).toEqual({ updatedCount: 1000 })
      expect(MockNotificationRepository.markManyAsReadForUser).toHaveBeenCalledWith(notificationIds, userId)
    })

    it('should handle no notifications updated', async () => {
      // arrange
      const userId = faker.string.uuid()
      const notificationIds = [faker.string.uuid(), faker.string.uuid()]

      // Repository returns 0 (no notifications were updated - maybe they were already read or not owned by user)
      MockNotificationRepository.markManyAsReadForUser.mockResolvedValue(0)

      // act
      const result = await notificationsUseCase.executeMarkManyAsRead(notificationIds, userId)

      // assert
      expect(result).toEqual({ updatedCount: 0 })
      expect(MockNotificationRepository.markManyAsReadForUser).toHaveBeenCalledWith(notificationIds, userId)
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
      const appointment = {
        id: faker.string.uuid(),
        appointmentDate: faker.date.future(),
        customerId: faker.string.uuid(),
        customer: {
          id: faker.string.uuid(),
          name: faker.person.fullName(),
          email: faker.internet.email(),
          notificationPreference: 'BOTH'
        },
        offer: {
          id: faker.string.uuid(),
          professionalId: faker.string.uuid(),
          professional: {
            id: faker.string.uuid(),
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
        title: 'Agendamento Criado',
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
      const appointment = {
        id: faker.string.uuid(),
        appointmentDate: faker.date.future(),
        customerId: faker.string.uuid(),
        customer: {
          id: faker.string.uuid(),
          name: faker.person.fullName(),
          email: faker.internet.email(),
          notificationPreference: 'IN_APP'
        },
        offer: {
          id: faker.string.uuid(),
          professionalId: faker.string.uuid(),
          professional: {
            id: faker.string.uuid(),
            name: faker.person.fullName(),
            email: faker.internet.email(),
            notificationPreference: 'IN_APP'
          },
          service: {
            id: faker.string.uuid(),
            name: faker.company.name()
          }
        }
      } as unknown as FindByIdAppointments

      MockNotificationRepository.findByMarker.mockResolvedValue(null)
      MockNotificationRepository.create.mockResolvedValue({} as Notification)

      // act
      await notificationsUseCase.executeSendOnAppointmentCreated(appointment)

      // assert
      expect(MockNotificationRepository.create).toHaveBeenCalled()
      expect(mockEmailService.sendAppointmentCreated).not.toHaveBeenCalled()
    })

    it('should send only email notification when professional prefers EMAIL', async () => {
      // arrange
      const appointment: FindByIdAppointments = {
        id: faker.string.uuid(),
        appointmentDate: faker.date.future(),
        customerId: faker.string.uuid(),
        customer: {
          id: faker.string.uuid(),
          name: faker.person.fullName(),
          email: faker.internet.email(),
          notificationPreference: 'EMAIL'
        },
        offer: {
          id: faker.string.uuid(),
          professionalId: faker.string.uuid(),
          professional: {
            id: faker.string.uuid(),
            name: faker.person.fullName(),
            email: faker.internet.email(),
            notificationPreference: 'EMAIL'
          },
          service: {
            id: faker.string.uuid(),
            name: faker.company.name()
          },
          estimatedTime: 60,
          price: 150.00
        }
      } as unknown as FindByIdAppointments

      MockNotificationRepository.findByMarker.mockResolvedValue(null)
      mockEmailService.sendAppointmentCreated.mockResolvedValue(undefined)

      // act
      await notificationsUseCase.executeSendOnAppointmentCreated(appointment)

      // assert
      expect(MockNotificationRepository.create).not.toHaveBeenCalled()
      expect(mockEmailService.sendAppointmentCreated).toHaveBeenCalled()
    })

    it('should not send any notification when professional prefers NONE', async () => {
      // arrange
      const appointment: FindByIdAppointments = {
        id: faker.string.uuid(),
        appointmentDate: faker.date.future(),
        customerId: faker.string.uuid(),
        customer: {
          id: faker.string.uuid(),
          name: faker.person.fullName(),
          email: faker.internet.email(),
          notificationPreference: 'NONE'
        },
        offer: {
          id: faker.string.uuid(),
          professionalId: faker.string.uuid(),
          professional: {
            id: faker.string.uuid(),
            name: faker.person.fullName(),
            email: faker.internet.email(),
            notificationPreference: 'NONE'
          },
          service: {
            id: faker.string.uuid(),
            name: faker.company.name()
          }
        }
      } as unknown as FindByIdAppointments

      MockNotificationRepository.findByMarker.mockResolvedValue(null)

      // act
      await notificationsUseCase.executeSendOnAppointmentCreated(appointment)

      // assert
      expect(MockNotificationRepository.create).not.toHaveBeenCalled()
      expect(mockEmailService.sendAppointmentCreated).not.toHaveBeenCalled()
    })

    it('should not send notification if marker already exists', async () => {
      // arrange
      const appointment: FindByIdAppointments = {
        id: faker.string.uuid(),
        appointmentDate: faker.date.future(),
        customerId: faker.string.uuid(),
        customer: {
          id: faker.string.uuid(),
          name: faker.person.fullName(),
          email: faker.internet.email(),
          notificationPreference: 'BOTH'
        },
        offer: {
          id: faker.string.uuid(),
          professionalId: faker.string.uuid(),
          professional: {
            id: faker.string.uuid(),
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
      const appointment: FindByIdAppointments = {
        id: faker.string.uuid(),
        appointmentDate: faker.date.future(),
        customerId: faker.string.uuid(),
        customer: {
          id: faker.string.uuid(),
          name: null,
          email: faker.internet.email(),
          notificationPreference: 'BOTH'
        },
        offer: {
          id: faker.string.uuid(),
          professionalId: faker.string.uuid(),
          professional: {
            id: faker.string.uuid(),
            name: null,
            email: faker.internet.email(),
            notificationPreference: 'BOTH'
          },
          service: {
            id: faker.string.uuid(),
            name: faker.company.name()
          }
        }
      } as unknown as FindByIdAppointments

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
      const appointment = {
        id: faker.string.uuid(),
        appointmentDate: faker.date.future(),
        customerId: faker.string.uuid(),
        customer: {
          id: faker.string.uuid(),
          name: faker.person.fullName(),
          email: faker.internet.email(),
          notificationPreference: 'BOTH'
        },
        offer: {
          id: faker.string.uuid(),
          professionalId: faker.string.uuid(),
          professional: {
            id: faker.string.uuid(),
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
        title: 'Agendamento confirmado',
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
      const appointment = {
        id: faker.string.uuid(),
        appointmentDate: faker.date.future(),
        customerId: faker.string.uuid(),
        customer: {
          id: faker.string.uuid(),
          name: faker.person.fullName(),
          email: faker.internet.email(),
          notificationPreference: 'IN_APP'
        },
        offer: {
          id: faker.string.uuid(),
          professionalId: faker.string.uuid(),
          professional: {
            id: faker.string.uuid(),
            name: faker.person.fullName(),
            email: faker.internet.email(),
            notificationPreference: 'IN_APP'
          },
          service: {
            id: faker.string.uuid(),
            name: faker.company.name()
          }
        }
      } as unknown as FindByIdAppointments

      MockNotificationRepository.findByMarker.mockResolvedValue(null)
      MockNotificationRepository.create.mockResolvedValue({} as Notification)

      // act
      await notificationsUseCase.executeSendOnAppointmentConfirmed(appointment)

      // assert
      expect(MockNotificationRepository.create).toHaveBeenCalled()
      expect(mockEmailService.sendAppointmentConfirmed).not.toHaveBeenCalled()
    })

    it('should send only email notification when customer prefers EMAIL', async () => {
      // arrange
      const appointment = {
        id: faker.string.uuid(),
        appointmentDate: faker.date.future(),
        customerId: faker.string.uuid(),
        customer: {
          id: faker.string.uuid(),
          name: faker.person.fullName(),
          email: faker.internet.email(),
          notificationPreference: 'EMAIL'
        },
        offer: {
          id: faker.string.uuid(),
          professionalId: faker.string.uuid(),
          professional: {
            id: faker.string.uuid(),
            name: faker.person.fullName(),
            email: faker.internet.email(),
            notificationPreference: 'EMAIL'
          },
          service: {
            id: faker.string.uuid(),
            name: faker.company.name()
          }
        }
      } as unknown as FindByIdAppointments

      MockNotificationRepository.findByMarker.mockResolvedValue(null)
      mockEmailService.sendAppointmentConfirmed.mockResolvedValue(undefined)

      // act
      await notificationsUseCase.executeSendOnAppointmentConfirmed(appointment)

      // assert
      expect(MockNotificationRepository.create).not.toHaveBeenCalled()
      expect(mockEmailService.sendAppointmentConfirmed).toHaveBeenCalled()
    })

    it('should not send any notification when customer prefers NONE', async () => {
      // arrange
      const appointment = {
        id: faker.string.uuid(),
        appointmentDate: faker.date.future(),
        customerId: faker.string.uuid(),
        customer: {
          id: faker.string.uuid(),
          name: faker.person.fullName(),
          email: faker.internet.email(),
          notificationPreference: 'NONE'
        },
        offer: {
          id: faker.string.uuid(),
          professionalId: faker.string.uuid(),
          professional: {
            id: faker.string.uuid(),
            name: faker.person.fullName(),
            email: faker.internet.email(),
            notificationPreference: 'NONE'
          },
          service: {
            id: faker.string.uuid(),
            name: faker.company.name()
          }
        }
      } as unknown as FindByIdAppointments

      MockNotificationRepository.findByMarker.mockResolvedValue(null)

      // act
      await notificationsUseCase.executeSendOnAppointmentConfirmed(appointment)

      // assert
      expect(MockNotificationRepository.create).not.toHaveBeenCalled()
      expect(mockEmailService.sendAppointmentConfirmed).not.toHaveBeenCalled()
    })

    it('should not send notification if marker already exists', async () => {
      // arrange
      const appointment = {
        id: faker.string.uuid(),
        appointmentDate: faker.date.future(),
        customerId: faker.string.uuid(),
        customer: {
          id: faker.string.uuid(),
          name: faker.person.fullName(),
          email: faker.internet.email(),
          notificationPreference: 'BOTH'
        },
        offer: {
          id: faker.string.uuid(),
          professionalId: faker.string.uuid(),
          professional: {
            id: faker.string.uuid(),
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
      const appointment = {
        id: faker.string.uuid(),
        appointmentDate: faker.date.future(),
        customerId: faker.string.uuid(),
        customer: {
          id: faker.string.uuid(),
          name: faker.person.fullName(),
          email: null,
          notificationPreference: 'BOTH'
        },
        offer: {
          id: faker.string.uuid(),
          professionalId: faker.string.uuid(),
          professional: {
            id: faker.string.uuid(),
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
      const appointment = {
        id: faker.string.uuid(),
        appointmentDate: faker.date.future(),
        customerId: faker.string.uuid(),
        customer: {
          id: faker.string.uuid(),
          name: faker.person.fullName(),
          email: faker.internet.email(),
          notificationPreference: 'BOTH'
        },
        offer: {
          id: faker.string.uuid(),
          professionalId: faker.string.uuid(),
          professional: {
            id: faker.string.uuid(),
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
        title: 'Agendamento cancelado',
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
      const appointment = {
        id: faker.string.uuid(),
        appointmentDate: faker.date.future(),
        customerId: faker.string.uuid(),
        customer: {
          id: faker.string.uuid(),
          name: faker.person.fullName(),
          email: faker.internet.email(),
          notificationPreference: 'BOTH'
        },
        offer: {
          id: faker.string.uuid(),
          professionalId: faker.string.uuid(),
          professional: {
            id: faker.string.uuid(),
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
        title: 'Agendamento cancelado',
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

    it('should notify both when both flags are true', async () => {
      // arrange
      const appointment = {
        id: faker.string.uuid(),
        appointmentDate: faker.date.future(),
        customerId: faker.string.uuid(),
        customer: {
          id: faker.string.uuid(),
          name: faker.person.fullName(),
          email: faker.internet.email(),
          notificationPreference: 'BOTH'
        },
        offer: {
          id: faker.string.uuid(),
          professionalId: faker.string.uuid(),
          professional: {
            id: faker.string.uuid(),
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

      MockNotificationRepository.findByMarker.mockResolvedValue(null)
      MockNotificationRepository.create.mockResolvedValue({} as Notification)
      mockEmailService.sendAppointmentCancelled.mockResolvedValue(undefined)

      // act
      await notificationsUseCase.executeSendOnAppointmentCancelled(appointment, {
        notifyCustomer: true,
        notifyProfessional: true
      })

      // assert
      expect(MockNotificationRepository.create).toHaveBeenCalledTimes(2)
      expect(mockEmailService.sendAppointmentCancelled).toHaveBeenCalledTimes(2)
    })

    it('should not notify anyone when both flags are false', async () => {
      // arrange
      const appointment = {
        id: faker.string.uuid(),
        appointmentDate: faker.date.future(),
        customerId: faker.string.uuid(),
        customer: {
          id: faker.string.uuid(),
          name: faker.person.fullName(),
          email: faker.internet.email(),
          notificationPreference: 'BOTH'
        },
        offer: {
          id: faker.string.uuid(),
          professionalId: faker.string.uuid(),
          professional: {
            id: faker.string.uuid(),
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
      const payload = {
        recipientId: faker.string.uuid(),
        recipientType: 'CUSTOMER' as const,
        notificationPreference: NotificationChannel.BOTH,
        email: faker.internet.email(),
        marker: faker.string.uuid(),
        title: 'Feliz Aniversário!',
        message: 'Desejamos um feliz aniversário!',
        templateKey: 'BIRTHDAY' as const,
        year: 2024
      }

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
      const payload = {
        recipientId: faker.string.uuid(),
        recipientType: 'CUSTOMER' as const,
        notificationPreference: NotificationChannel.IN_APP,
        email: faker.internet.email(),
        marker: faker.string.uuid(),
        title: 'Feliz Aniversário!',
        message: 'Desejamos um feliz aniversário!'
      }

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

    it('should send only email notification when preference is EMAIL', async () => {
      // arrange
      const payload = {
        recipientId: faker.string.uuid(),
        recipientType: 'CUSTOMER' as const,
        notificationPreference: NotificationChannel.EMAIL,
        email: faker.internet.email(),
        marker: faker.string.uuid(),
        title: 'Feliz Aniversário!',
        message: 'Desejamos um feliz aniversário!'
      }

      MockNotificationRepository.findByMarker.mockResolvedValue(null)
      mockEmailService.sendBirthday.mockResolvedValue(undefined)

      // act
      await notificationsUseCase.executeSendBirthday(payload)

      // assert
      expect(MockNotificationRepository.create).not.toHaveBeenCalled()
      expect(mockEmailService.sendBirthday).toHaveBeenCalledWith({
        to: payload.email,
        title: payload.title,
        message: payload.message,
        customerName: undefined
      })
    })

    it('should not send notification if marker already exists', async () => {
      // arrange
      const payload = {
        recipientId: faker.string.uuid(),
        recipientType: 'CUSTOMER' as const,
        notificationPreference: NotificationChannel.BOTH,
        email: faker.internet.email(),
        marker: faker.string.uuid(),
        title: 'Feliz Aniversário!',
        message: 'Desejamos um feliz aniversário!'
      }

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
      const payload = {
        recipientId: faker.string.uuid(),
        recipientType: 'CUSTOMER' as const,
        notificationPreference: NotificationChannel.BOTH,
        email: null,
        marker: faker.string.uuid(),
        title: 'Feliz Aniversário!',
        message: 'Desejamos um feliz aniversário!'
      }

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
      const payload = {
        recipientId: faker.string.uuid(),
        recipientType: 'CUSTOMER' as const,
        notificationPreference: NotificationChannel.NONE,
        email: faker.internet.email(),
        marker: faker.string.uuid(),
        title: 'Feliz Aniversário!',
        message: 'Desejamos um feliz aniversário!'
      }

      MockNotificationRepository.findByMarker.mockResolvedValue(null)

      // act
      await notificationsUseCase.executeSendBirthday(payload)

      // assert
      expect(MockNotificationRepository.create).not.toHaveBeenCalled()
      expect(mockEmailService.sendBirthday).not.toHaveBeenCalled()
    })
  })
})