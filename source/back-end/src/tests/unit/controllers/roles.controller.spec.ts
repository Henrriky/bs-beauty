/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { type Role, type Prisma } from '@prisma/client'
import { StatusCodes } from 'http-status-codes'
import { makeRoleUseCaseFactory } from '../../../factory/make-role-use-case.factory'
import { RolesController } from '../../../controllers/roles.controller'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { mockRequest, mockResponse } from '../utils/test-utilts'

vi.mock('@/factory/make-role-use-case.factory')

describe('RolesController (Unit Tests)', () => {
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
      executeFindAllPaginated: vi.fn(),
      executeFindAll: vi.fn(),
      executeFindById: vi.fn(),
      executeFindRoleAssociations: vi.fn(),
      executeAddPermissionToRole: vi.fn(),
      executeRemovePermissionFromRole: vi.fn(),
      executeCreate: vi.fn(),
      executeUpdate: vi.fn(),
      executeDelete: vi.fn()
    }

    vi.mocked(makeRoleUseCaseFactory).mockReturnValue(useCaseMock)
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should be defined', () => {
    expect(RolesController).toBeDefined()
  })

  describe('handleFindAllPaginated', () => {
    it('should return paginated roles list', async () => {
      // arrange
      const mockResult = {
        data: [
          {
            id: 'role-123',
            name: 'MANAGER',
            description: 'Manager role',
            createdAt: new Date(),
            updatedAt: new Date()
          }
        ],
        pagination: {
          currentPage: 1,
          totalPages: 1,
          totalItems: 1,
          itemsPerPage: 10
        }
      }

      req.query = { page: '1', limit: '10' }
      useCaseMock.executeFindAllPaginated.mockResolvedValueOnce(mockResult)

      // act
      await RolesController.handleFindAllPaginated(req, res, next)

      // assert
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
      // arrange
      const error = new Error('Database connection failed')
      req.query = { page: '1', limit: '10' }
      useCaseMock.executeFindAllPaginated.mockRejectedValueOnce(error)

      // act
      await RolesController.handleFindAllPaginated(req, res, next)

      // assert
      expect(useCaseMock.executeFindAllPaginated).toHaveBeenCalledTimes(1)
      expect(res.send).not.toHaveBeenCalled()
      expect(next).toHaveBeenCalledTimes(1)
      expect(next).toHaveBeenCalledWith(error)
    })
  })

  describe('handleFindAll', () => {
    it('should return all roles', async () => {
      // arrange
      const mockRoles = [
        {
          id: 'role-123',
          name: 'MANAGER',
          description: 'Manager role',
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ]

      useCaseMock.executeFindAll.mockResolvedValueOnce({ roles: mockRoles })

      // act
      await RolesController.handleFindAll(req, res, next)

      // assert
      expect(useCaseMock.executeFindAll).toHaveBeenCalledTimes(1)
      expect(res.send).toHaveBeenCalledWith({ roles: mockRoles })
      expect(next).not.toHaveBeenCalled()
    })

    it('should call next with an error if executeFindAll fails', async () => {
      // arrange
      const error = new Error('Database connection failed')
      useCaseMock.executeFindAll.mockRejectedValueOnce(error)

      // act
      await RolesController.handleFindAll(req, res, next)

      // assert
      expect(useCaseMock.executeFindAll).toHaveBeenCalledTimes(1)
      expect(res.send).not.toHaveBeenCalled()
      expect(next).toHaveBeenCalledTimes(1)
      expect(next).toHaveBeenCalledWith(error)
    })
  })

  describe('handleFindById', () => {
    it('should return a role by id', async () => {
      // arrange
      const roleId = 'role-123'
      const mockRole: Role = {
        id: roleId,
        name: 'MANAGER',
        description: 'Manager role',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }

      req.params.id = roleId
      useCaseMock.executeFindById.mockResolvedValueOnce(mockRole)

      // act
      await RolesController.handleFindById(req, res, next)

      // assert
      expect(useCaseMock.executeFindById).toHaveBeenCalledTimes(1)
      expect(useCaseMock.executeFindById).toHaveBeenCalledWith(roleId)
      expect(res.send).toHaveBeenCalledWith(mockRole)
      expect(next).not.toHaveBeenCalled()
    })

    it('should call next with an error if executeFindById fails', async () => {
      // arrange
      const error = new Error('Role not found')
      const roleId = 'role-123'
      req.params.id = roleId
      useCaseMock.executeFindById.mockRejectedValueOnce(error)

      // act
      await RolesController.handleFindById(req, res, next)

      // assert
      expect(useCaseMock.executeFindById).toHaveBeenCalledTimes(1)
      expect(useCaseMock.executeFindById).toHaveBeenCalledWith(roleId)
      expect(res.send).not.toHaveBeenCalled()
      expect(next).toHaveBeenCalledTimes(1)
      expect(next).toHaveBeenCalledWith(error)
    })
  })

  describe('handleFindRoleAssociations', () => {
    it('should return role associations with default values', async () => {
      // arrange
      const roleId = 'role-123'
      const mockResult = {
        data: [],
        pagination: {
          currentPage: 1,
          totalPages: 0,
          totalItems: 0,
          itemsPerPage: 10
        }
      }

      req.params.id = roleId
      req.query = {}
      useCaseMock.executeFindRoleAssociations.mockResolvedValueOnce(mockResult)

      // act
      await RolesController.handleFindRoleAssociations(req, res, next)

      // assert
      expect(useCaseMock.executeFindRoleAssociations).toHaveBeenCalledTimes(1)
      expect(useCaseMock.executeFindRoleAssociations).toHaveBeenCalledWith(roleId, {
        page: 1,
        limit: 10,
        filters: { type: 'all' }
      })
      expect(res.send).toHaveBeenCalledWith(mockResult)
      expect(next).not.toHaveBeenCalled()
    })

    it('should return role associations with custom parameters', async () => {
      // arrange
      const roleId = 'role-123'
      const mockResult = {
        data: [],
        pagination: {
          currentPage: 2,
          totalPages: 0,
          totalItems: 0,
          itemsPerPage: 5
        }
      }

      req.params.id = roleId
      req.query = { page: '2', limit: '5', type: 'permission' }
      useCaseMock.executeFindRoleAssociations.mockResolvedValueOnce(mockResult)

      // act
      await RolesController.handleFindRoleAssociations(req, res, next)

      // assert
      expect(useCaseMock.executeFindRoleAssociations).toHaveBeenCalledTimes(1)
      expect(useCaseMock.executeFindRoleAssociations).toHaveBeenCalledWith(roleId, {
        page: 2,
        limit: 5,
        filters: { type: 'permission' }
      })
      expect(res.send).toHaveBeenCalledWith(mockResult)
      expect(next).not.toHaveBeenCalled()
    })

    it('should call next with an error if executeFindRoleAssociations fails', async () => {
      // arrange
      const error = new Error('Association fetch failed')
      const roleId = 'role-123'
      req.params.id = roleId
      req.query = {}
      useCaseMock.executeFindRoleAssociations.mockRejectedValueOnce(error)

      // act
      await RolesController.handleFindRoleAssociations(req, res, next)

      // assert
      expect(useCaseMock.executeFindRoleAssociations).toHaveBeenCalledTimes(1)
      expect(res.send).not.toHaveBeenCalled()
      expect(next).toHaveBeenCalledTimes(1)
      expect(next).toHaveBeenCalledWith(error)
    })
  })

  describe('handleAddPermissionToRole', () => {
    it('should add permission to role successfully', async () => {
      // arrange
      const roleId = 'role-123'
      const permissionId = 'permission-456'
      req.params.id = roleId
      req.body = { permissionId }
      useCaseMock.executeAddPermissionToRole.mockResolvedValueOnce(undefined)

      // act
      await RolesController.handleAddPermissionToRole(req, res, next)

      // assert
      expect(useCaseMock.executeAddPermissionToRole).toHaveBeenCalledTimes(1)
      expect(useCaseMock.executeAddPermissionToRole).toHaveBeenCalledWith(roleId, permissionId)
      expect(res.status).toHaveBeenCalledWith(StatusCodes.CREATED)
      expect(res.send).toHaveBeenCalledWith({ message: 'Permission added to Role successfully' })
      expect(next).not.toHaveBeenCalled()
    })

    it('should call next with an error if executeAddPermissionToRole fails', async () => {
      // arrange
      const error = new Error('Permission association failed')
      const roleId = 'role-123'
      const permissionId = 'permission-456'
      req.params.id = roleId
      req.body = { permissionId }
      useCaseMock.executeAddPermissionToRole.mockRejectedValueOnce(error)

      // act
      await RolesController.handleAddPermissionToRole(req, res, next)

      // assert
      expect(useCaseMock.executeAddPermissionToRole).toHaveBeenCalledTimes(1)
      expect(useCaseMock.executeAddPermissionToRole).toHaveBeenCalledWith(roleId, permissionId)
      expect(res.status).not.toHaveBeenCalled()
      expect(res.send).not.toHaveBeenCalled()
      expect(next).toHaveBeenCalledTimes(1)
      expect(next).toHaveBeenCalledWith(error)
    })
  })

  describe('handleRemovePermissionFromRole', () => {
    it('should remove permission from role successfully', async () => {
      // arrange
      const roleId = 'role-123'
      const permissionId = 'permission-456'
      req.params.id = roleId
      req.body = { permissionId }
      useCaseMock.executeRemovePermissionFromRole.mockResolvedValueOnce(undefined)

      // act
      await RolesController.handleRemovePermissionFromRole(req, res, next)

      // assert
      expect(useCaseMock.executeRemovePermissionFromRole).toHaveBeenCalledTimes(1)
      expect(useCaseMock.executeRemovePermissionFromRole).toHaveBeenCalledWith(roleId, permissionId)
      expect(res.send).toHaveBeenCalledWith({ message: 'Permission removed from Role successfully' })
      expect(next).not.toHaveBeenCalled()
    })

    it('should call next with an error if executeRemovePermissionFromRole fails', async () => {
      // arrange
      const error = new Error('Permission removal failed')
      const roleId = 'role-123'
      const permissionId = 'permission-456'
      req.params.id = roleId
      req.body = { permissionId }
      useCaseMock.executeRemovePermissionFromRole.mockRejectedValueOnce(error)

      // act
      await RolesController.handleRemovePermissionFromRole(req, res, next)

      // assert
      expect(useCaseMock.executeRemovePermissionFromRole).toHaveBeenCalledTimes(1)
      expect(useCaseMock.executeRemovePermissionFromRole).toHaveBeenCalledWith(roleId, permissionId)
      expect(res.send).not.toHaveBeenCalled()
      expect(next).toHaveBeenCalledTimes(1)
      expect(next).toHaveBeenCalledWith(error)
    })
  })

  describe('handleCreate', () => {
    it('should create a role successfully', async () => {
      // arrange
      const roleToCreate: Prisma.RoleCreateInput = {
        name: 'NEW_ROLE',
        description: 'New role for testing'
      }
      const createdRole: Role = {
        id: 'role-123',
        name: 'NEW_ROLE',
        description: 'New role for testing',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }

      req.body = roleToCreate
      useCaseMock.executeCreate.mockResolvedValueOnce(createdRole)

      // act
      await RolesController.handleCreate(req, res, next)

      // assert
      expect(useCaseMock.executeCreate).toHaveBeenCalledTimes(1)
      expect(useCaseMock.executeCreate).toHaveBeenCalledWith(roleToCreate)
      expect(res.status).toHaveBeenCalledWith(StatusCodes.CREATED)
      expect(res.send).toHaveBeenCalledWith(createdRole)
      expect(next).not.toHaveBeenCalled()
    })

    it('should call next with an error if executeCreate fails', async () => {
      // arrange
      const error = new Error('Role creation failed')
      const roleToCreate: Prisma.RoleCreateInput = {
        name: 'NEW_ROLE',
        description: 'New role for testing'
      }

      req.body = roleToCreate
      useCaseMock.executeCreate.mockRejectedValueOnce(error)

      // act
      await RolesController.handleCreate(req, res, next)

      // assert
      expect(useCaseMock.executeCreate).toHaveBeenCalledTimes(1)
      expect(useCaseMock.executeCreate).toHaveBeenCalledWith(roleToCreate)
      expect(res.status).not.toHaveBeenCalled()
      expect(res.send).not.toHaveBeenCalled()
      expect(next).toHaveBeenCalledTimes(1)
      expect(next).toHaveBeenCalledWith(error)
    })
  })

  describe('handleUpdate', () => {
    it('should update a role successfully', async () => {
      // arrange
      const roleId = 'role-123'
      const roleToUpdate: Prisma.RoleUpdateInput = {
        name: 'UPDATED_ROLE',
        description: 'Updated role description'
      }
      const updatedRole: Role = {
        id: roleId,
        name: 'UPDATED_ROLE',
        description: 'Updated role description',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }

      req.params.id = roleId
      req.body = roleToUpdate
      useCaseMock.executeUpdate.mockResolvedValueOnce(updatedRole)

      // act
      await RolesController.handleUpdate(req, res, next)

      // assert
      expect(useCaseMock.executeUpdate).toHaveBeenCalledTimes(1)
      expect(useCaseMock.executeUpdate).toHaveBeenCalledWith(roleId, roleToUpdate)
      expect(res.send).toHaveBeenCalledWith(updatedRole)
      expect(next).not.toHaveBeenCalled()
    })

    it('should call next with an error if executeUpdate fails', async () => {
      // arrange
      const error = new Error('Role update failed')
      const roleId = 'role-123'
      const roleToUpdate: Prisma.RoleUpdateInput = {
        name: 'UPDATED_ROLE',
        description: 'Updated role description'
      }

      req.params.id = roleId
      req.body = roleToUpdate
      useCaseMock.executeUpdate.mockRejectedValueOnce(error)

      // act
      await RolesController.handleUpdate(req, res, next)

      // assert
      expect(useCaseMock.executeUpdate).toHaveBeenCalledTimes(1)
      expect(useCaseMock.executeUpdate).toHaveBeenCalledWith(roleId, roleToUpdate)
      expect(res.send).not.toHaveBeenCalled()
      expect(next).toHaveBeenCalledTimes(1)
      expect(next).toHaveBeenCalledWith(error)
    })
  })

  describe('handleDelete', () => {
    it('should delete a role successfully', async () => {
      // arrange
      const roleId = 'role-123'
      const deletedRole: Role = {
        id: roleId,
        name: 'DELETED_ROLE',
        description: 'Role to be deleted',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }

      req.params.id = roleId
      useCaseMock.executeDelete.mockResolvedValueOnce(deletedRole)

      // act
      await RolesController.handleDelete(req, res, next)

      // assert
      expect(useCaseMock.executeDelete).toHaveBeenCalledTimes(1)
      expect(useCaseMock.executeDelete).toHaveBeenCalledWith(roleId)
      expect(res.send).toHaveBeenCalledWith(deletedRole)
      expect(next).not.toHaveBeenCalled()
    })

    it('should call next with an error if executeDelete fails', async () => {
      // arrange
      const error = new Error('Role deletion failed')
      const roleId = 'role-123'
      req.params.id = roleId
      useCaseMock.executeDelete.mockRejectedValueOnce(error)

      // act
      await RolesController.handleDelete(req, res, next)

      // assert
      expect(useCaseMock.executeDelete).toHaveBeenCalledTimes(1)
      expect(useCaseMock.executeDelete).toHaveBeenCalledWith(roleId)
      expect(res.send).not.toHaveBeenCalled()
      expect(next).toHaveBeenCalledTimes(1)
      expect(next).toHaveBeenCalledWith(error)
    })
  })
})
