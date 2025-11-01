import { type Permission } from '@prisma/client'
import { PermissionUseCase } from '../../../services/permissions.use-case'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { type PermissionRepository } from '../../../repository/protocols/permission.repository'

const MockPermissionRepository: PermissionRepository = {
  findAllPaginated: vi.fn()
}

describe('PermissionUseCase (Unit Tests)', () => {
  let permissionUseCase: PermissionUseCase

  beforeEach(() => {
    permissionUseCase = new PermissionUseCase(MockPermissionRepository)
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  describe('executeFindAllPaginated', () => {
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
          resource: 'USER',
          action: 'READ',
          description: 'Read users',
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

      MockPermissionRepository.findAllPaginated = vi.fn().mockResolvedValue(mockResult)

      const params = {
        page: 1,
        limit: 10,
        filters: { resource: 'USER' }
      }

      // Act
      const result = await permissionUseCase.executeFindAllPaginated(params)

      // Assert
      expect(MockPermissionRepository.findAllPaginated).toHaveBeenCalledTimes(1)
      expect(MockPermissionRepository.findAllPaginated).toHaveBeenCalledWith(params)
      expect(result).toEqual(mockResult)
    })

    it('should fix invalid page values', async () => {
      // Arrange
      const mockResult = {
        data: [],
        total: 0,
        page: 1,
        totalPages: 0,
        limit: 10
      }

      MockPermissionRepository.findAllPaginated = vi.fn().mockResolvedValue(mockResult)

      const params = {
        page: -1, // invalid page
        limit: 10,
        filters: {}
      }

      // Act
      await permissionUseCase.executeFindAllPaginated(params)

      // Assert
      expect(MockPermissionRepository.findAllPaginated).toHaveBeenCalledWith({
        page: 1, // should be fixed to 1
        limit: 10,
        filters: {}
      })
    })

    it('should fix invalid limit values', async () => {
      // Arrange
      const mockResult = {
        data: [],
        total: 0,
        page: 1,
        totalPages: 0,
        limit: 10
      }

      MockPermissionRepository.findAllPaginated = vi.fn().mockResolvedValue(mockResult)

      const params = {
        page: 1,
        limit: 0, // invalid limit
        filters: {}
      }

      // Act
      await permissionUseCase.executeFindAllPaginated(params)

      // Assert
      expect(MockPermissionRepository.findAllPaginated).toHaveBeenCalledWith({
        page: 1,
        limit: 10, // should be fixed to 10
        filters: {}
      })
    })

    it('should enforce maximum limit of 100', async () => {
      // Arrange
      const mockResult = {
        data: [],
        total: 0,
        page: 1,
        totalPages: 0,
        limit: 10
      }

      MockPermissionRepository.findAllPaginated = vi.fn().mockResolvedValue(mockResult)

      const params = {
        page: 1,
        limit: 200, // too high limit
        filters: {}
      }

      // Act
      await permissionUseCase.executeFindAllPaginated(params)

      // Assert
      expect(MockPermissionRepository.findAllPaginated).toHaveBeenCalledWith({
        page: 1,
        limit: 10, // should be fixed to 10
        filters: {}
      })
    })

    it('should handle filters properly', async () => {
      // Arrange
      const mockResult = {
        data: [],
        total: 0,
        page: 1,
        totalPages: 0,
        limit: 10
      }

      MockPermissionRepository.findAllPaginated = vi.fn().mockResolvedValue(mockResult)

      const params = {
        page: 1,
        limit: 10,
        filters: {
          resource: 'SERVICE',
          action: 'APPROVE',
          search: 'aprovar'
        }
      }

      // Act
      await permissionUseCase.executeFindAllPaginated(params)

      // Assert
      expect(MockPermissionRepository.findAllPaginated).toHaveBeenCalledTimes(1)
      expect(MockPermissionRepository.findAllPaginated).toHaveBeenCalledWith(params)
    })
  })
})
