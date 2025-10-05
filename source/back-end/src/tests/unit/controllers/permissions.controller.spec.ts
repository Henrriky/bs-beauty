/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { type Permission } from '@prisma/client'
import { makePermissionUseCaseFactory } from '../../../factory/make-permission-use-case.factory'
import { PermissionsController } from '../../../controllers/permissions.controller'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { mockRequest, mockResponse } from '../utils/test-utilts'

vi.mock('@/factory/make-permission-use-case.factory')

describe('PermissionsController (Unit Tests)', () => {
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
      executeFindAllPaginated: vi.fn()
    }

    vi.mocked(makePermissionUseCaseFactory).mockReturnValue(useCaseMock)
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should be defined', () => {
    expect(PermissionsController).toBeDefined()
  })

  describe('handleFindAllPaginated', () => {
    it('should return paginated permissions successfully', async () => {
      // Arrange
      const mockPermissions: Permission[] = [
        {
          id: 'perm-1',
          resource: 'USER',
          action: 'CREATE',
          description: 'Create users',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 'perm-2',
          resource: 'SERVICE',
          action: 'APPROVE',
          description: 'Approve service',
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ]

      const mockResult = {
        data: mockPermissions,
        total: 2,
        page: 1,
        totalPages: 1,
        limit: 10
      }

      req.query = {
        page: '1',
        limit: '10',
        resource: 'USER'
      }

      useCaseMock.executeFindAllPaginated.mockResolvedValue(mockResult)

      // Act
      await PermissionsController.handleFindAllPaginated(req, res, next)

      // Assert
      expect(useCaseMock.executeFindAllPaginated).toHaveBeenCalledTimes(1)
      expect(useCaseMock.executeFindAllPaginated).toHaveBeenCalledWith({
        page: 1,
        limit: 10,
        filters: {
          resource: 'USER'
        }
      })
      expect(res.send).toHaveBeenCalledWith(mockResult)
      expect(next).not.toHaveBeenCalled()
    })

    it('should handle query parameters with all filters', async () => {
      // Arrange
      const mockResult = {
        data: [],
        total: 0,
        page: 1,
        totalPages: 0,
        limit: 20
      }

      req.query = {
        page: '1',
        limit: '20',
        resource: 'SERVICE',
        action: 'APPROVE',
        search: 'aprovar'
      }

      useCaseMock.executeFindAllPaginated.mockResolvedValue(mockResult)

      // Act
      await PermissionsController.handleFindAllPaginated(req, res, next)

      // Assert
      expect(useCaseMock.executeFindAllPaginated).toHaveBeenCalledTimes(1)
      expect(useCaseMock.executeFindAllPaginated).toHaveBeenCalledWith({
        page: 1,
        limit: 20,
        filters: {
          resource: 'SERVICE',
          action: 'APPROVE',
          search: 'aprovar'
        }
      })
      expect(res.send).toHaveBeenCalledWith(mockResult)
      expect(next).not.toHaveBeenCalled()
    })

    it('should handle empty query parameters with defaults', async () => {
      // Arrange
      const mockResult = {
        data: [],
        total: 0,
        page: 1,
        totalPages: 0,
        limit: 10
      }

      req.query = {}
      useCaseMock.executeFindAllPaginated.mockResolvedValue(mockResult)

      // Act
      await PermissionsController.handleFindAllPaginated(req, res, next)

      // Assert
      expect(useCaseMock.executeFindAllPaginated).toHaveBeenCalledTimes(1)
      expect(useCaseMock.executeFindAllPaginated).toHaveBeenCalledWith({
        page: 1,
        limit: 10,
        filters: {}
      })
      expect(res.send).toHaveBeenCalledWith(mockResult)
      expect(next).not.toHaveBeenCalled()
    })

    it('should call next with an error if executeFindAllPaginated fails', async () => {
      // Arrange
      const error = new Error('Database connection failed')
      req.query = { page: '1', limit: '10' }
      useCaseMock.executeFindAllPaginated.mockRejectedValue(error)

      // Act
      await PermissionsController.handleFindAllPaginated(req, res, next)

      // Assert
      expect(useCaseMock.executeFindAllPaginated).toHaveBeenCalledTimes(1)
      expect(res.send).not.toHaveBeenCalled()
      expect(next).toHaveBeenCalledTimes(1)
      expect(next).toHaveBeenCalledWith(error)
    })

    it('should handle invalid query parameters and let schema validation handle it', async () => {
      // Arrange
      const mockResult = {
        data: [],
        total: 0,
        page: 1,
        totalPages: 0,
        limit: 10
      }

      req.query = {
        page: 'invalid',
        limit: 'invalid'
      }

      useCaseMock.executeFindAllPaginated.mockResolvedValue(mockResult)

      // Act
      await PermissionsController.handleFindAllPaginated(req, res, next)

      // Assert
      expect(useCaseMock.executeFindAllPaginated).toHaveBeenCalledTimes(1)
      expect(useCaseMock.executeFindAllPaginated).toHaveBeenCalledWith({
        page: 1, // schema should default to 1 for invalid values
        limit: 10, // schema should default to 10 for invalid values
        filters: {}
      })
      expect(res.send).toHaveBeenCalledWith(mockResult)
      expect(next).not.toHaveBeenCalled()
    })
  })
})
