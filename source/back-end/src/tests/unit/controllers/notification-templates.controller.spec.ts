/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { faker } from '@faker-js/faker'
import { type NotificationTemplate } from '@prisma/client'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { NotificationTemplatesController } from '../../../controllers/notification-templates.controller'
import { makeNotificationTemplatesUseCaseFactory } from '../../../factory/make-notification-templates-use-case.factory'
import { mockRequest, mockResponse } from '../utils/test-utilts'

vi.mock('@/factory/make-notification-templates-use-case.factory')

// Helper functions
function createMockNotificationTemplate(overrides: Partial<NotificationTemplate> = {}): NotificationTemplate {
  return {
    id: faker.string.uuid(),
    key: 'BIRTHDAY',
    name: 'Birthday Template',
    description: 'Template for birthday notifications',
    title: 'Happy Birthday {customerName}!',
    body: 'We wish you a very happy birthday!',
    variables: ['customerName'],
    isActive: true,
    createdAt: faker.date.past(),
    updatedAt: faker.date.past(),
    ...overrides
  }
}

function createMockPaginationResult<T>(data: T[], overrides: Partial<{ total: number; page: number; totalPages: number; limit: number }> = {}) {
  return {
    data,
    total: data.length,
    page: 1,
    totalPages: 1,
    limit: 10,
    ...overrides
  }
}

describe('NotificationTemplatesController', () => {
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
      executeUpdate: vi.fn()
    }

    vi.mocked(makeNotificationTemplatesUseCaseFactory).mockReturnValue(useCaseMock)
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should be defined', () => {
    expect(NotificationTemplatesController).toBeDefined()
  })

  describe('handleFindAll', () => {
    it('should return a list of notification templates with default pagination', async () => {
      // arrange
      const mockTemplates: NotificationTemplate[] = [
        createMockNotificationTemplate(),
        createMockNotificationTemplate({
          id: faker.string.uuid(),
          key: 'APPOINTMENT_REMINDER',
          name: 'Appointment Reminder',
          description: 'Template for appointment reminders',
          title: 'Appointment Reminder',
          body: 'Your appointment is scheduled for {appointmentDate}',
          variables: ['appointmentDate']
        })
      ]

      const mockResult = createMockPaginationResult(mockTemplates, { total: 2 })

      req.query = { page: '1', limit: '10' }
      useCaseMock.executeFindAll.mockResolvedValue(mockResult)

      // act
      await NotificationTemplatesController.handleFindAll(req, res, next)

      // assert
      expect(useCaseMock.executeFindAll).toHaveBeenCalledWith({
        page: 1,
        limit: 10,
        filters: {}
      })
      expect(res.send).toHaveBeenCalledWith(mockResult)
      expect(next).not.toHaveBeenCalled()
    })

    it('should return templates with name filter', async () => {
      // arrange
      const mockTemplates: NotificationTemplate[] = [
        createMockNotificationTemplate()
      ]

      const mockResult = createMockPaginationResult(mockTemplates, { total: 1 })

      req.query = { page: '1', limit: '10', name: 'Birthday' }
      useCaseMock.executeFindAll.mockResolvedValue(mockResult)

      // act
      await NotificationTemplatesController.handleFindAll(req, res, next)

      // assert
      expect(useCaseMock.executeFindAll).toHaveBeenCalledWith({
        page: 1,
        limit: 10,
        filters: { name: 'Birthday' }
      })
      expect(res.send).toHaveBeenCalledWith(mockResult)
      expect(next).not.toHaveBeenCalled()
    })

    it('should return templates with key filter', async () => {
      // arrange
      const mockTemplates: NotificationTemplate[] = [
        createMockNotificationTemplate()
      ]

      const mockResult = createMockPaginationResult(mockTemplates, { total: 1, limit: 20 })

      req.query = { page: '1', limit: '20', key: 'BIRTHDAY' }
      useCaseMock.executeFindAll.mockResolvedValue(mockResult)

      // act
      await NotificationTemplatesController.handleFindAll(req, res, next)

      // assert
      expect(useCaseMock.executeFindAll).toHaveBeenCalledWith({
        page: 1,
        limit: 20,
        filters: { key: 'BIRTHDAY' }
      })
      expect(res.send).toHaveBeenCalledWith(mockResult)
      expect(next).not.toHaveBeenCalled()
    })

    it('should handle errors and call next middleware', async () => {
      // arrange
      const error = new Error('Database connection failed')
      req.query = { page: '1', limit: '10' }
      useCaseMock.executeFindAll.mockRejectedValue(error)

      // act
      await NotificationTemplatesController.handleFindAll(req, res, next)

      // assert
      expect(useCaseMock.executeFindAll).toHaveBeenCalled()
      expect(next).toHaveBeenCalledWith(error)
      expect(res.send).not.toHaveBeenCalled()
    })

    it('should return empty result when no templates found', async () => {
      // arrange
      const mockEmptyResult = createMockPaginationResult([], { total: 0, totalPages: 0 })

      req.query = { page: '1', limit: '10' }
      useCaseMock.executeFindAll.mockResolvedValue(mockEmptyResult)

      // act
      await NotificationTemplatesController.handleFindAll(req, res, next)

      // assert
      expect(useCaseMock.executeFindAll).toHaveBeenCalledWith({
        page: 1,
        limit: 10,
        filters: {}
      })
      expect(res.send).toHaveBeenCalledWith(mockEmptyResult)
      expect(next).not.toHaveBeenCalled()
    })
  })

  describe('handleUpdate', () => {
    it('should update notification template successfully', async () => {
      // arrange
      const templateKey = 'birthday'
      const updateData = {
        name: 'Updated Template Name',
        description: 'Updated description',
        title: 'Updated Title {customerName}',
        body: 'Updated body content',
        variables: ['customerName'],
        isActive: false
      }

      const updatedTemplate = createMockNotificationTemplate({
        key: templateKey.toUpperCase(),
        name: updateData.name,
        description: updateData.description,
        title: updateData.title,
        body: updateData.body,
        variables: updateData.variables,
        isActive: updateData.isActive,
        updatedAt: new Date()
      })

      useCaseMock.executeUpdate.mockResolvedValue(updatedTemplate)

      req.params = { key: templateKey }
      req.body = updateData

      // act
      await NotificationTemplatesController.handleUpdate(req, res, next)

      // assert
      expect(useCaseMock.executeUpdate).toHaveBeenCalledWith(templateKey.toUpperCase(), updateData)
      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.send).toHaveBeenCalledWith(updatedTemplate)
      expect(next).not.toHaveBeenCalled()
    })

    it('should handle use case errors and call next middleware', async () => {
      // arrange
      const templateKey = 'birthday'
      const updateData = {
        name: 'Template Name',
        description: 'Template description',
        title: 'Title',
        body: 'Body',
        variables: ['var1'],
        isActive: true
      }
      const error = new Error('Update failed')

      useCaseMock.executeUpdate.mockRejectedValue(error)

      req.params = { key: templateKey }
      req.body = updateData

      // act
      await NotificationTemplatesController.handleUpdate(req, res, next)

      // assert
      expect(useCaseMock.executeUpdate).toHaveBeenCalledWith(templateKey.toUpperCase(), updateData)
      expect(res.status).not.toHaveBeenCalled()
      expect(res.send).not.toHaveBeenCalled()
      expect(next).toHaveBeenCalledWith(error)
    })

    it('should normalize key to uppercase', async () => {
      // arrange
      const templateKey = 'birthday'
      const updateData = {
        name: 'Template Name',
        description: 'Template description',
        title: 'Title',
        body: 'Body',
        variables: ['var1'],
        isActive: true
      }

      const updatedTemplate = createMockNotificationTemplate({
        key: 'BIRTHDAY',
        name: updateData.name,
        description: updateData.description,
        title: updateData.title,
        body: updateData.body,
        variables: updateData.variables,
        isActive: updateData.isActive,
        updatedAt: new Date()
      })

      useCaseMock.executeUpdate.mockResolvedValue(updatedTemplate)

      req.params = { key: templateKey }
      req.body = updateData

      // act
      await NotificationTemplatesController.handleUpdate(req, res, next)

      // assert
      expect(useCaseMock.executeUpdate).toHaveBeenCalledWith('BIRTHDAY', updateData)
      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.send).toHaveBeenCalledWith(updatedTemplate)
      expect(next).not.toHaveBeenCalled()
    })

    it('should handle empty key parameter', async () => {
      // arrange
      const updateData = {
        name: 'Template Name',
        description: 'Template description',
        title: 'Title',
        body: 'Body',
        variables: ['var1'],
        isActive: true
      }

      req.params = { key: '' }
      req.body = updateData

      // act
      await NotificationTemplatesController.handleUpdate(req, res, next)

      // assert
      expect(useCaseMock.executeUpdate).toHaveBeenCalledWith('', updateData)
      expect(next).not.toHaveBeenCalledWith(
        expect.objectContaining({
          statusCode: 400
        })
      )
    })
  })
})