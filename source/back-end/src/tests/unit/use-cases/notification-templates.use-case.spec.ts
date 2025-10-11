import { NotificationTemplateUseCase, extractPlaceholders } from '../../../services/notifications-template.use-case'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { faker } from '@faker-js/faker'
import { CustomError } from '../../../utils/errors/custom.error.util'
import type { NotificationTemplate } from '@prisma/client'
import type { NotificationTemplateRepository } from '../../../repository/protocols/notification-template.repository'
import { Mocked } from 'vitest'

describe('NotificationTemplateUseCase', () => {
  let useCase: NotificationTemplateUseCase
  let repositoryMock: Mocked<NotificationTemplateRepository>

  beforeEach(() => {
    vi.clearAllMocks()
    repositoryMock = {
      findAll: vi.fn(),
      findActiveByKey: vi.fn(),
      updateByKey: vi.fn()
    }
    useCase = new NotificationTemplateUseCase(repositoryMock)
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('executeFindAll', () => {
    it('should return paginated notification templates', async () => {
      // arrange
      const params = {
        page: 1,
        limit: 10,
        filters: {
          name: 'Birthday',
          key: 'BIRTHDAY'
        }
      }

      const mockTemplates: NotificationTemplate[] = [
        {
          id: faker.string.uuid(),
          key: 'BIRTHDAY',
          name: 'Birthday Template',
          description: 'Template for birthday notifications',
          title: 'Happy Birthday {customerName}!',
          body: 'We wish you a very happy birthday!',
          variables: ['customerName'],
          isActive: true,
          createdAt: faker.date.past(),
          updatedAt: faker.date.past()
        }
      ]

      const mockResult = {
        data: mockTemplates,
        total: 1,
        page: 1,
        totalPages: 1,
        limit: 10
      }

      repositoryMock.findAll.mockResolvedValue(mockResult)

      // act
      const result = await useCase.executeFindAll(params)

      // assert
      expect(repositoryMock.findAll).toHaveBeenCalledWith(params)
      expect(result).toEqual(mockResult)
    })

    it('should handle empty results', async () => {
      // arrange
      const params = {
        page: 1,
        limit: 10,
        filters: {}
      }

      const mockResult = {
        data: [],
        total: 0,
        page: 1,
        totalPages: 0,
        limit: 10
      }

      repositoryMock.findAll.mockResolvedValue(mockResult)

      // act
      const result = await useCase.executeFindAll(params)

      // assert
      expect(repositoryMock.findAll).toHaveBeenCalledWith(params)
      expect(result).toEqual(mockResult)
    })

    it('should pass filters correctly to repository', async () => {
      // arrange
      const params = {
        page: 2,
        limit: 5,
        filters: {
          name: 'Appointment',
          key: 'APPOINTMENT_REMINDER'
        }
      }

      const mockResult = {
        data: [],
        total: 0,
        page: 2,
        totalPages: 0,
        limit: 5
      }

      repositoryMock.findAll.mockResolvedValue(mockResult)

      // act
      await useCase.executeFindAll(params)

      // assert
      expect(repositoryMock.findAll).toHaveBeenCalledWith({
        page: 2,
        limit: 5,
        filters: {
          name: 'Appointment',
          key: 'APPOINTMENT_REMINDER'
        }
      })
    })
  })

  describe('executeUpdate', () => {
    it('should update notification template successfully', async () => {
      // arrange
      const key = 'BIRTHDAY'
      const existingTemplate: NotificationTemplate = {
        id: faker.string.uuid(),
        key: 'BIRTHDAY',
        name: 'Birthday Template',
        description: 'Template for birthday notifications',
        title: 'Happy Birthday {customerName}!',
        body: 'We wish you a very happy birthday!',
        variables: ['customerName'],
        isActive: true,
        createdAt: faker.date.past(),
        updatedAt: faker.date.past()
      }

      const updateData = {
        name: 'Updated Birthday Template',
        description: 'Updated description',
        title: 'Happy Birthday {customerName}! We hope you have a great day.',
        body: 'We wish you a very happy birthday {customerName}!'
      }

      const updatedTemplate: NotificationTemplate = {
        ...existingTemplate,
        ...updateData,
        updatedAt: new Date()
      }

      repositoryMock.findActiveByKey.mockResolvedValue(existingTemplate)
      repositoryMock.updateByKey.mockResolvedValue(updatedTemplate)

      // act
      const result = await useCase.executeUpdate(key, updateData)

      // assert
      expect(repositoryMock.findActiveByKey).toHaveBeenCalledWith(key)
      expect(repositoryMock.updateByKey).toHaveBeenCalledWith(key, updateData)
      expect(result).toEqual(updatedTemplate)
    })

    it('should throw error when template not found', async () => {
      // arrange
      const key = 'NON_EXISTENT'
      const updateData = {
        name: 'Updated Template'
      }

      repositoryMock.findActiveByKey.mockResolvedValue(null)

      // act & assert
      await expect(useCase.executeUpdate(key, updateData))
        .rejects
        .toThrow('Not Found')
    })

    it('should validate placeholders when updating title', async () => {
      // arrange
      const key = 'BIRTHDAY'
      const existingTemplate: NotificationTemplate = {
        id: faker.string.uuid(),
        key: 'BIRTHDAY',
        name: 'Birthday Template',
        description: 'Template for birthday notifications',
        title: 'Happy Birthday {customerName}!',
        body: 'We wish you a very happy birthday!',
        variables: ['customerName'],
        isActive: true,
        createdAt: faker.date.past(),
        updatedAt: faker.date.past()
      }

      const updateData = {
        title: 'Happy Birthday {customerName} and {invalidPlaceholder}!'
      }

      repositoryMock.findActiveByKey.mockResolvedValue(existingTemplate)

      // act & assert
      await expect(useCase.executeUpdate(key, updateData))
        .rejects
        .toThrow('Invalid placeholders along the title/body.')
    })

    it('should validate placeholders when updating body', async () => {
      // arrange
      const key = 'BIRTHDAY'
      const existingTemplate: NotificationTemplate = {
        id: faker.string.uuid(),
        key: 'BIRTHDAY',
        name: 'Birthday Template',
        description: 'Template for birthday notifications',
        title: 'Happy Birthday {customerName}!',
        body: 'We wish you a very happy birthday!',
        variables: ['customerName'],
        isActive: true,
        createdAt: faker.date.past(),
        updatedAt: faker.date.past()
      }

      const updateData = {
        body: 'We wish you a very happy birthday {customerName} and {invalidPlaceholder}!'
      }

      repositoryMock.findActiveByKey.mockResolvedValue(existingTemplate)

      // act & assert
      await expect(useCase.executeUpdate(key, updateData))
        .rejects
        .toThrow('Invalid placeholders along the title/body.')
    })

    it('should allow placeholders that are in variables array', async () => {
      // arrange
      const key = 'BIRTHDAY'
      const existingTemplate: NotificationTemplate = {
        id: faker.string.uuid(),
        key: 'BIRTHDAY',
        name: 'Birthday Template',
        description: 'Template for birthday notifications',
        title: 'Happy Birthday {customerName}!',
        body: 'We wish you a very happy birthday!',
        variables: ['customerName', 'businessName'],
        isActive: true,
        createdAt: faker.date.past(),
        updatedAt: faker.date.past()
      }

      const updateData = {
        title: 'Happy Birthday {customerName}! From {businessName}',
        body: 'We wish you a very happy birthday {customerName}!'
      }

      const updatedTemplate: NotificationTemplate = {
        ...existingTemplate,
        ...updateData,
        updatedAt: new Date()
      }

      repositoryMock.findActiveByKey.mockResolvedValue(existingTemplate)
      repositoryMock.updateByKey.mockResolvedValue(updatedTemplate)

      // act
      const result = await useCase.executeUpdate(key, updateData)

      // assert
      expect(repositoryMock.updateByKey).toHaveBeenCalledWith(key, updateData)
      expect(result).toEqual(updatedTemplate)
    })

    it('should use existing template placeholders as fallback when variables array is empty', async () => {
      // arrange
      const key = 'BIRTHDAY'
      const existingTemplate: NotificationTemplate = {
        id: faker.string.uuid(),
        key: 'BIRTHDAY',
        name: 'Birthday Template',
        description: 'Template for birthday notifications',
        title: 'Happy Birthday {customerName}!',
        body: 'We wish you a very happy birthday {businessName}!',
        variables: [], // empty variables array
        isActive: true,
        createdAt: faker.date.past(),
        updatedAt: faker.date.past()
      }

      const updateData = {
        title: 'Happy Birthday {customerName}! From {businessName}'
      }

      const updatedTemplate: NotificationTemplate = {
        ...existingTemplate,
        ...updateData,
        updatedAt: new Date()
      }

      repositoryMock.findActiveByKey.mockResolvedValue(existingTemplate)
      repositoryMock.updateByKey.mockResolvedValue(updatedTemplate)

      // act
      const result = await useCase.executeUpdate(key, updateData)

      // assert
      expect(repositoryMock.updateByKey).toHaveBeenCalledWith(key, updateData)
      expect(result).toEqual(updatedTemplate)
    })

    it('should handle Prisma StringFieldUpdateOperationsInput', async () => {
      // arrange
      const key = 'BIRTHDAY'
      const existingTemplate: NotificationTemplate = {
        id: faker.string.uuid(),
        key: 'BIRTHDAY',
        name: 'Birthday Template',
        description: 'Template for birthday notifications',
        title: 'Happy Birthday {customerName}!',
        body: 'We wish you a very happy birthday!',
        variables: ['customerName'],
        isActive: true,
        createdAt: faker.date.past(),
        updatedAt: faker.date.past()
      }

      const updateData = {
        title: { set: 'Happy Birthday {customerName}! Have a great day.' }
      }

      const updatedTemplate: NotificationTemplate = {
        ...existingTemplate,
        title: 'Happy Birthday {customerName}! Have a great day.',
        updatedAt: new Date()
      }

      repositoryMock.findActiveByKey.mockResolvedValue(existingTemplate)
      repositoryMock.updateByKey.mockResolvedValue(updatedTemplate)

      // act
      const result = await useCase.executeUpdate(key, updateData)

      // assert
      expect(repositoryMock.updateByKey).toHaveBeenCalledWith(key, updateData)
      expect(result).toEqual(updatedTemplate)
    })

    it('should handle CustomError with proper details for invalid placeholders', async () => {
      // arrange
      const key = 'BIRTHDAY'
      const existingTemplate: NotificationTemplate = {
        id: faker.string.uuid(),
        key: 'BIRTHDAY',
        name: 'Birthday Template',
        description: 'Template for birthday notifications',
        title: 'Happy Birthday {customerName}!',
        body: 'We wish you a very happy birthday!',
        variables: ['customerName'],
        isActive: true,
        createdAt: faker.date.past(),
        updatedAt: faker.date.past()
      }

      const updateData = {
        title: 'Happy Birthday {customerName} and {invalidOne} and {invalidTwo}!'
      }

      repositoryMock.findActiveByKey.mockResolvedValue(existingTemplate)

      // act & assert
      try {
        await useCase.executeUpdate(key, updateData)
        expect.fail('Should have thrown an error')
      } catch (error) {
        expect(error).toBeInstanceOf(CustomError)
        expect((error as CustomError).statusCode).toBe(422)
        expect((error as CustomError).message).toBe('Invalid placeholders along the title/body.')

        const details = JSON.parse((error as CustomError).details!)
        expect(details.invalidPlaceholders).toContain('{invalidOne}')
        expect(details.invalidPlaceholders).toContain('{invalidTwo}')
        expect(details.allowedPlaceholders).toContain('{customerName}')
      }
    })
  })

  describe('extractPlaceholders utility function', () => {
    it('should extract placeholders from text', () => {
      // arrange
      const text = 'Hello {customerName}, your appointment is on {appointmentDate}'

      // act
      const placeholders = extractPlaceholders(text)

      // assert
      expect(placeholders).toEqual(['customerName', 'appointmentDate'])
    })

    it('should handle text without placeholders', () => {
      // arrange
      const text = 'Hello there, no placeholders here'

      // act
      const placeholders = extractPlaceholders(text)

      // assert
      expect(placeholders).toEqual([])
    })

    it('should handle duplicate placeholders', () => {
      // arrange
      const text = 'Hello {customerName}, {customerName} has an appointment'

      // act
      const placeholders = extractPlaceholders(text)

      // assert
      expect(placeholders).toEqual(['customerName', 'customerName'])
    })

    it('should handle nested braces correctly', () => {
      // arrange
      const text = 'Hello {customerName}, your code is {{not_a_placeholder}}'

      // act
      const placeholders = extractPlaceholders(text)

      // assert
      expect(placeholders).toEqual(['customerName', 'not_a_placeholder'])
    })
  })
})