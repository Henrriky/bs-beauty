/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { StatusCodes } from 'http-status-codes'
import { NotificationsController } from '../../../controllers/notifications.controller'
import { makeNotificationsUseCaseFactory } from '../../../factory/make-notifications-use-case.factory'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { mockRequest, mockResponse } from '../utils/test-utilts'
import { faker } from '@faker-js/faker'
import { NotificationType, UserType, type Notification } from '@prisma/client'

vi.mock('@/factory/make-notifications-use-case.factory')

// Helper functions to reduce duplication
const createMockUser = (userType: UserType = UserType.CUSTOMER) => ({
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

describe('NotificationsController', () => {
  let req: any
  let res: any
  let next: any
  let useCaseMock: any

  beforeEach(() => {
    vi.clearAllMocks()

    req = mockRequest()
    res = mockResponse()
    next = vi.fn()

    useCaseMock = {
      executeFindAll: vi.fn(),
      executeFindById: vi.fn(),
      executeDelete: vi.fn(),
      executeMarkManyAsRead: vi.fn()
    }

    vi.mocked(makeNotificationsUseCaseFactory).mockReturnValue(useCaseMock)
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should be defined', () => {
    expect(NotificationsController).toBeDefined()
  })

  describe('handleFindAll', () => {
    it('should return a list of notifications with default pagination', async () => {
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

      req.user = mockUser
      req.query = { page: '1', limit: '10' }
      useCaseMock.executeFindAll.mockResolvedValue(mockResult)

      // act
      await NotificationsController.handleFindAll(req, res, next)

      // assert
      expect(useCaseMock.executeFindAll).toHaveBeenCalledWith(
        mockUser,
        {
          page: 1,
          limit: 10,
          filters: { readStatus: 'ALL' }
        }
      )
      expect(res.status).toHaveBeenCalledWith(StatusCodes.OK)
      expect(res.send).toHaveBeenCalledWith(mockResult)
      expect(next).not.toHaveBeenCalled()
    })

    it('should return notifications with readStatus filter', async () => {
      // arrange
      const mockUser = createMockUser(UserType.PROFESSIONAL)
      const mockNotifications = [
        createMockNotification({
          recipientId: mockUser.id,
          recipientType: UserType.PROFESSIONAL,
          type: NotificationType.APPOINTMENT
        })
      ]
      const mockResult = createMockPaginationResult(mockNotifications, 1, 20)

      req.user = mockUser
      req.query = { page: '1', limit: '20', readStatus: 'UNREAD' }
      useCaseMock.executeFindAll.mockResolvedValue(mockResult)

      // act
      await NotificationsController.handleFindAll(req, res, next)

      // assert
      expect(useCaseMock.executeFindAll).toHaveBeenCalledWith(
        mockUser,
        {
          page: 1,
          limit: 20,
          filters: { readStatus: 'UNREAD' }
        }
      )
      expect(res.status).toHaveBeenCalledWith(StatusCodes.OK)
      expect(res.send).toHaveBeenCalledWith(mockResult)
      expect(next).not.toHaveBeenCalled()
    })

    it('should handle errors and call next middleware', async () => {
      // arrange
      const mockUser = createMockUser()
      const error = new Error('Database connection failed')

      req.user = mockUser
      req.query = { page: '1', limit: '10' }
      useCaseMock.executeFindAll.mockRejectedValue(error)

      // act
      await NotificationsController.handleFindAll(req, res, next)

      // assert
      expect(useCaseMock.executeFindAll).toHaveBeenCalled()
      expect(next).toHaveBeenCalledWith(error)
      expect(res.status).not.toHaveBeenCalled()
      expect(res.send).not.toHaveBeenCalled()
    })

    it('should pass all query filters to use case', async () => {
      // arrange
      const mockUser = createMockUser()
      const mockResult = createMockPaginationResult([], 2, 5)

      req.user = mockUser
      req.query = {
        page: '2',
        limit: '5',
        readStatus: 'read'
      }
      useCaseMock.executeFindAll.mockResolvedValue(mockResult)

      // act
      await NotificationsController.handleFindAll(req, res, next)

      // assert
      expect(useCaseMock.executeFindAll).toHaveBeenCalledWith(
        mockUser,
        {
          page: 2,
          limit: 5,
          filters: { readStatus: 'READ' }
        }
      )
      expect(res.status).toHaveBeenCalledWith(StatusCodes.OK)
      expect(res.send).toHaveBeenCalledWith(mockResult)
    })
  })

  describe('handleFindById', () => {
    it('should return a notification by id', async () => {
      // arrange
      const notificationId = faker.string.uuid()
      const mockNotification = createMockNotification({ id: notificationId })

      req.params = { id: notificationId }
      useCaseMock.executeFindById.mockResolvedValue(mockNotification)

      // act
      await NotificationsController.handleFindById(req, res, next)

      // assert
      expect(useCaseMock.executeFindById).toHaveBeenCalledWith(notificationId)
      expect(res.send).toHaveBeenCalledWith(mockNotification)
      expect(next).not.toHaveBeenCalled()
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

      req.params = { id: notificationId }
      useCaseMock.executeFindById.mockResolvedValue(mockNotification)

      // act
      await NotificationsController.handleFindById(req, res, next)

      // assert
      expect(useCaseMock.executeFindById).toHaveBeenCalledWith(notificationId)
      expect(res.send).toHaveBeenCalledWith(mockNotification)
      expect(next).not.toHaveBeenCalled()
    })

    it('should handle errors and call next middleware', async () => {
      // arrange
      const notificationId = faker.string.uuid()
      const error = new Error('Notification not found')

      req.params = { id: notificationId }
      useCaseMock.executeFindById.mockRejectedValue(error)

      // act
      await NotificationsController.handleFindById(req, res, next)

      // assert
      expect(useCaseMock.executeFindById).toHaveBeenCalledWith(notificationId)
      expect(next).toHaveBeenCalledWith(error)
      expect(res.send).not.toHaveBeenCalled()
    })

    it('should handle when notification is null', async () => {
      // arrange
      const notificationId = faker.string.uuid()

      req.params = { id: notificationId }
      useCaseMock.executeFindById.mockResolvedValue(null)

      // act
      await NotificationsController.handleFindById(req, res, next)

      // assert
      expect(useCaseMock.executeFindById).toHaveBeenCalledWith(notificationId)
      expect(res.send).toHaveBeenCalledWith(null)
      expect(next).not.toHaveBeenCalled()
    })
  })

  describe('handleDelete', () => {
    it('should delete a notification successfully', async () => {
      // arrange
      const notificationId = faker.string.uuid()
      const deletedNotification = createMockNotification({ id: notificationId })

      req.params = { id: notificationId }
      useCaseMock.executeDelete.mockResolvedValue(deletedNotification)

      // act
      await NotificationsController.handleDelete(req, res, next)

      // assert
      expect(useCaseMock.executeDelete).toHaveBeenCalledWith(notificationId)
      expect(res.send).toHaveBeenCalledWith(deletedNotification)
      expect(next).not.toHaveBeenCalled()
    })

    it('should delete a read notification successfully', async () => {
      // arrange
      const notificationId = faker.string.uuid()
      const deletedNotification = createMockNotification({
        id: notificationId,
        recipientType: UserType.PROFESSIONAL,
        type: NotificationType.APPOINTMENT,
        readAt: faker.date.past()
      })

      req.params = { id: notificationId }
      useCaseMock.executeDelete.mockResolvedValue(deletedNotification)

      // act
      await NotificationsController.handleDelete(req, res, next)

      // assert
      expect(useCaseMock.executeDelete).toHaveBeenCalledWith(notificationId)
      expect(res.send).toHaveBeenCalledWith(deletedNotification)
      expect(next).not.toHaveBeenCalled()
    })

    it('should handle errors and call next middleware', async () => {
      // arrange
      const notificationId = faker.string.uuid()
      const error = new Error('Notification not found')

      req.params = { id: notificationId }
      useCaseMock.executeDelete.mockRejectedValue(error)

      // act
      await NotificationsController.handleDelete(req, res, next)

      // assert
      expect(useCaseMock.executeDelete).toHaveBeenCalledWith(notificationId)
      expect(next).toHaveBeenCalledWith(error)
      expect(res.send).not.toHaveBeenCalled()
    })

    it('should handle deletion of different notification types', async () => {
      // arrange
      const notificationId = faker.string.uuid()
      const deletedSystemNotification = createMockNotification({
        id: notificationId,
        recipientType: UserType.MANAGER,
        readAt: faker.date.past()
      })

      req.params = { id: notificationId }
      useCaseMock.executeDelete.mockResolvedValue(deletedSystemNotification)

      // act
      await NotificationsController.handleDelete(req, res, next)

      // assert
      expect(useCaseMock.executeDelete).toHaveBeenCalledWith(notificationId)
      expect(res.send).toHaveBeenCalledWith(deletedSystemNotification)
      expect(next).not.toHaveBeenCalled()
    })
  })

  describe('handleMarkManyAsRead', () => {
    it('should mark multiple notifications as read successfully', async () => {
      // arrange
      const mockUser = createMockUser()
      const notificationIds = [
        faker.string.uuid(),
        faker.string.uuid(),
        faker.string.uuid()
      ]
      const mockResult = { updatedCount: 3 }

      req.user = mockUser
      req.body = { ids: notificationIds }
      useCaseMock.executeMarkManyAsRead.mockResolvedValue(mockResult)

      // act
      await NotificationsController.handleMarkManyAsRead(req, res, next)

      // assert
      expect(useCaseMock.executeMarkManyAsRead).toHaveBeenCalledWith(notificationIds, mockUser.id)
      expect(res.send).toHaveBeenCalledWith(mockResult)
      expect(next).not.toHaveBeenCalled()
    })

    it('should handle validation error for empty array of IDs', async () => {
      // arrange
      const mockUser = createMockUser(UserType.PROFESSIONAL)

      req.user = mockUser
      req.body = { ids: [] }

      // act
      await NotificationsController.handleMarkManyAsRead(req, res, next)

      // assert
      expect(next).toHaveBeenCalled()
      const errorArg = next.mock.calls[0][0]
      expect(errorArg).toBeInstanceOf(Error)
      expect(useCaseMock.executeMarkManyAsRead).not.toHaveBeenCalled()
    })

    it('should handle single notification ID', async () => {
      // arrange
      const mockUser = createMockUser()
      const notificationIds = [faker.string.uuid()]
      const mockResult = { updatedCount: 1 }

      req.user = mockUser
      req.body = { ids: notificationIds }
      useCaseMock.executeMarkManyAsRead.mockResolvedValue(mockResult)

      // act
      await NotificationsController.handleMarkManyAsRead(req, res, next)

      // assert
      expect(useCaseMock.executeMarkManyAsRead).toHaveBeenCalledWith(notificationIds, mockUser.id)
      expect(res.send).toHaveBeenCalledWith(mockResult)
      expect(next).not.toHaveBeenCalled()
    })

    it('should handle validation errors and call next middleware', async () => {
      // arrange
      const mockUser = createMockUser()

      req.user = mockUser
      req.body = { ids: ['invalid-uuid', 'another-invalid'] }

      // act
      await NotificationsController.handleMarkManyAsRead(req, res, next)

      // assert
      expect(next).toHaveBeenCalled()
      const errorArg = next.mock.calls[0][0]
      expect(errorArg).toBeInstanceOf(Error)
      expect(useCaseMock.executeMarkManyAsRead).not.toHaveBeenCalled()
    })

    it('should handle use case errors and call next middleware', async () => {
      // arrange
      const mockUser = createMockUser(UserType.PROFESSIONAL)
      const notificationIds = [faker.string.uuid(), faker.string.uuid()]
      const error = new Error('Database update failed')

      req.user = mockUser
      req.body = { ids: notificationIds }
      useCaseMock.executeMarkManyAsRead.mockRejectedValue(error)

      // act
      await NotificationsController.handleMarkManyAsRead(req, res, next)

      // assert
      expect(useCaseMock.executeMarkManyAsRead).toHaveBeenCalledWith(notificationIds, mockUser.id)
      expect(next).toHaveBeenCalledWith(error)
      expect(res.send).not.toHaveBeenCalled()
    })

    it('should handle maximum limit of IDs', async () => {
      // arrange
      const mockUser = createMockUser(UserType.MANAGER)
      // Generate 1000 valid UUIDs (the maximum allowed)
      const notificationIds = Array.from({ length: 1000 }, () => faker.string.uuid())
      const mockResult = { updatedCount: 1000 }

      req.user = mockUser
      req.body = { ids: notificationIds }
      useCaseMock.executeMarkManyAsRead.mockResolvedValue(mockResult)

      // act
      await NotificationsController.handleMarkManyAsRead(req, res, next)

      // assert
      expect(useCaseMock.executeMarkManyAsRead).toHaveBeenCalledWith(notificationIds, mockUser.id)
      expect(res.send).toHaveBeenCalledWith(mockResult)
      expect(next).not.toHaveBeenCalled()
    })
  })
})