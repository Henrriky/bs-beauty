import { RoleUseCase } from '@/services/roles.use-case'
import { MockRoleRepository } from '../utils/mocks/repository'
import { faker } from '@faker-js/faker'
import { type Role, type Prisma, type Permission, type Professional, NotificationChannel } from '@prisma/client'
import { CustomError } from '@/utils/errors/custom.error.util'

describe('RoleUseCase (Unit Tests)', () => {
  let roleUseCase: RoleUseCase

  beforeEach(() => {
    roleUseCase = new RoleUseCase(MockRoleRepository)
    vi.clearAllMocks()
  })

  it('should be defined', () => {
    expect(roleUseCase).toBeDefined()
  })

  describe('executeFindAll', () => {
    it('should return all roles', async () => {
      const roles: Role[] = [
        {
          id: faker.string.uuid(),
          name: 'Admin',
          description: faker.lorem.sentence(),
          isActive: true,
          createdAt: faker.date.past(),
          updatedAt: faker.date.past()
        }
      ]

      const mockPaginatedResult = {
        data: roles,
        total: 1,
        page: 1,
        totalPages: 1,
        limit: 1000
      }

      MockRoleRepository.findAllPaginated.mockResolvedValue(mockPaginatedResult)

      const result = await roleUseCase.executeFindAll()
      expect(result).toEqual({ roles })
      expect(MockRoleRepository.findAllPaginated).toHaveBeenCalledWith({
        page: 1,
        limit: 1000,
        filters: {}
      })
    })

    it('should return empty array when no roles are found', async () => {
      const mockPaginatedResult = {
        data: [],
        total: 0,
        page: 1,
        totalPages: 0,
        limit: 1000
      }

      MockRoleRepository.findAllPaginated.mockResolvedValue(mockPaginatedResult)

      const result = await roleUseCase.executeFindAll()

      expect(result).toEqual({ roles: [] })
      expect(MockRoleRepository.findAllPaginated).toHaveBeenCalledWith({
        page: 1,
        limit: 1000,
        filters: {}
      })
    })
  })

  describe('executeFindById', () => {
    it('should return a role by id', async () => {
      const role: Role = {
        id: faker.string.uuid(),
        name: 'Admin',
        description: faker.lorem.sentence(),
        isActive: true,
        createdAt: faker.date.past(),
        updatedAt: faker.date.past()
      }

      MockRoleRepository.findById.mockResolvedValue(role)

      const result = await roleUseCase.executeFindById(role.id)
      expect(result).toEqual(role)
      expect(MockRoleRepository.findById).toHaveBeenCalledWith(role.id)
    })

    it('should throw an error if role is not found', async () => {
      const roleId = faker.string.uuid()
      MockRoleRepository.findById.mockResolvedValue(null)

      const promise = roleUseCase.executeFindById(roleId)
      await expect(promise).rejects.toBeInstanceOf(CustomError)
    })
  })

  describe('executeCreate', () => {
    it('should create a new role successfully', async () => {
      const roleToCreate: Prisma.RoleCreateInput = {
        name: 'Admin',
        description: faker.lorem.sentence(),
        isActive: true
      }

      const createdRole: Role = {
        id: faker.string.uuid(),
        name: roleToCreate.name,
        description: roleToCreate.description ?? null,
        isActive: roleToCreate.isActive ?? false,
        createdAt: faker.date.past(),
        updatedAt: faker.date.past()
      }

      // Não existe role com o mesmo nome
      MockRoleRepository.findByName.mockResolvedValue(null)
      MockRoleRepository.create.mockResolvedValue(createdRole)

      const result = await roleUseCase.executeCreate(roleToCreate)

      expect(result).toEqual(createdRole)
      expect(MockRoleRepository.findByName).toHaveBeenCalledWith('Admin')
      expect(MockRoleRepository.create).toHaveBeenCalledWith(roleToCreate)
    })

    it('should throw an error when trying to create a role with existing name', async () => {
      const roleToCreate: Prisma.RoleCreateInput = {
        name: 'Admin',
        description: faker.lorem.sentence(),
        isActive: true
      }

      const existingRole: Role = {
        id: faker.string.uuid(),
        name: 'Admin',
        description: faker.lorem.sentence(),
        isActive: true,
        createdAt: faker.date.past(),
        updatedAt: faker.date.past()
      }

      // Já existe uma role com o nome "Admin"
      MockRoleRepository.findByName.mockResolvedValue(existingRole)

      const promise = roleUseCase.executeCreate(roleToCreate)

      await expect(promise).rejects.toBeInstanceOf(CustomError)
      expect(MockRoleRepository.findByName).toHaveBeenCalledWith('Admin')
      expect(MockRoleRepository.create).not.toHaveBeenCalled()
    })
  })

  describe('executeUpdate', () => {
    it('should update a role successfully', async () => {
      const roleId = faker.string.uuid()
      const roleToUpdate: Prisma.RoleUpdateInput = {
        description: 'Updated description'
      }

      const existingRole: Role = {
        id: roleId,
        name: 'Admin',
        description: 'Original description',
        isActive: true,
        createdAt: faker.date.past(),
        updatedAt: faker.date.past()
      }

      const updatedRole: Role = {
        ...existingRole,
        description: 'Updated description',
        updatedAt: new Date()
      }

      MockRoleRepository.findById.mockResolvedValue(existingRole)
      MockRoleRepository.update.mockResolvedValue(updatedRole)

      const result = await roleUseCase.executeUpdate(roleId, roleToUpdate)

      expect(result).toEqual(updatedRole)
      expect(MockRoleRepository.findById).toHaveBeenCalledWith(roleId)
      expect(MockRoleRepository.update).toHaveBeenCalledWith(roleId, roleToUpdate)
    })

    it('should validate unique name when updating role name', async () => {
      const roleId = faker.string.uuid()
      const roleToUpdate: Prisma.RoleUpdateInput = {
        name: 'Manager'
      }

      const existingRole: Role = {
        id: roleId,
        name: 'Admin',
        description: faker.lorem.sentence(),
        isActive: true,
        createdAt: faker.date.past(),
        updatedAt: faker.date.past()
      }

      const roleWithSameName: Role = {
        id: faker.string.uuid(),
        name: 'Manager',
        description: faker.lorem.sentence(),
        isActive: true,
        createdAt: faker.date.past(),
        updatedAt: faker.date.past()
      }

      MockRoleRepository.findById.mockResolvedValue(existingRole)
      MockRoleRepository.findByName.mockResolvedValue(roleWithSameName)

      const promise = roleUseCase.executeUpdate(roleId, roleToUpdate)

      await expect(promise).rejects.toBeInstanceOf(CustomError)
      expect(MockRoleRepository.findById).toHaveBeenCalledWith(roleId)
      expect(MockRoleRepository.findByName).toHaveBeenCalledWith('Manager')
    })
  })

  describe('executeDelete', () => {
    it('should delete a role successfully', async () => {
      const roleId = faker.string.uuid()
      const roleToDelete: Role = {
        id: roleId,
        name: 'Admin',
        description: faker.lorem.sentence(),
        isActive: true,
        createdAt: faker.date.past(),
        updatedAt: faker.date.past()
      }

      MockRoleRepository.findById.mockResolvedValue(roleToDelete)
      MockRoleRepository.delete.mockResolvedValue(roleToDelete)

      const result = await roleUseCase.executeDelete(roleId)

      expect(result).toEqual(roleToDelete)
      expect(MockRoleRepository.findById).toHaveBeenCalledWith(roleId)
      expect(MockRoleRepository.delete).toHaveBeenCalledWith(roleId)
    })

    it('should throw an error if role to delete is not found', async () => {
      const roleId = faker.string.uuid()
      MockRoleRepository.findById.mockResolvedValue(null)

      const promise = roleUseCase.executeDelete(roleId)

      await expect(promise).rejects.toBeInstanceOf(CustomError)
      expect(MockRoleRepository.findById).toHaveBeenCalledWith(roleId)
      expect(MockRoleRepository.delete).not.toHaveBeenCalled()
    })
  })

  describe('executeFindAllPaginated', () => {
    it('should return paginated roles without filters', async () => {
      const roles: Role[] = Array.from({ length: 5 }, () => ({
        id: faker.string.uuid(),
        name: faker.person.jobTitle(),
        description: faker.lorem.sentence(),
        isActive: true,
        createdAt: faker.date.past(),
        updatedAt: faker.date.past()
      }))

      const mockResult = {
        data: roles,
        total: 5,
        page: 1,
        totalPages: 1,
        limit: 10
      }

      MockRoleRepository.findAllPaginated.mockResolvedValue(mockResult)

      const params = {
        page: 1,
        limit: 10,
        filters: {}
      }

      const result = await roleUseCase.executeFindAllPaginated(params)

      expect(result).toEqual(mockResult)
      expect(MockRoleRepository.findAllPaginated).toHaveBeenCalledWith(params)
    })

    it('should return filtered roles by name', async () => {
      const editorRole: Role = {
        id: faker.string.uuid(),
        name: 'Editor',
        description: faker.lorem.sentence(),
        isActive: true,
        createdAt: faker.date.past(),
        updatedAt: faker.date.past()
      }

      const mockResult = {
        data: [editorRole],
        total: 1,
        page: 1,
        totalPages: 1,
        limit: 10
      }

      MockRoleRepository.findAllPaginated.mockResolvedValue(mockResult)

      const params = {
        page: 1,
        limit: 10,
        filters: { name: 'Ed' }
      }

      const result = await roleUseCase.executeFindAllPaginated(params)

      expect(result).toEqual(mockResult)
      expect(MockRoleRepository.findAllPaginated).toHaveBeenCalledWith(params)
    })
  })

  describe('executeUpdate', () => {
    it('should update role successfully when new name does not exist', async () => {
      const roleId = faker.string.uuid()
      const existingRole: Role = {
        id: roleId,
        name: 'Editor',
        description: faker.lorem.sentence(),
        isActive: true,
        createdAt: faker.date.past(),
        updatedAt: faker.date.past()
      }

      const roleToUpdate: Prisma.RoleUpdateInput = {
        name: 'Supervisor',
        description: 'Updated description'
      }

      const updatedRole: Role = {
        ...existingRole,
        name: 'Supervisor',
        description: 'Updated description'
      }

      MockRoleRepository.findById.mockResolvedValue(existingRole)
      MockRoleRepository.findByName.mockResolvedValue(null) // Nome não existe
      MockRoleRepository.update.mockResolvedValue(updatedRole)

      const result = await roleUseCase.executeUpdate(roleId, roleToUpdate)

      expect(result).toEqual(updatedRole)
      expect(MockRoleRepository.findById).toHaveBeenCalledWith(roleId)
      expect(MockRoleRepository.findByName).toHaveBeenCalledWith('Supervisor')
      expect(MockRoleRepository.update).toHaveBeenCalledWith(roleId, roleToUpdate)
    })

    it('should throw error when trying to update role with existing name', async () => {
      const roleId = faker.string.uuid()
      const existingRole: Role = {
        id: roleId,
        name: 'Editor',
        description: faker.lorem.sentence(),
        isActive: true,
        createdAt: faker.date.past(),
        updatedAt: faker.date.past()
      }

      const anotherRole: Role = {
        id: faker.string.uuid(),
        name: 'Admin',
        description: faker.lorem.sentence(),
        isActive: true,
        createdAt: faker.date.past(),
        updatedAt: faker.date.past()
      }

      const roleToUpdate: Prisma.RoleUpdateInput = {
        name: 'Admin'
      }

      MockRoleRepository.findById.mockResolvedValue(existingRole)
      MockRoleRepository.findByName.mockResolvedValue(anotherRole) // Nome já existe

      const promise = roleUseCase.executeUpdate(roleId, roleToUpdate)

      await expect(promise).rejects.toBeInstanceOf(CustomError)
      expect(MockRoleRepository.findById).toHaveBeenCalledWith(roleId)
      expect(MockRoleRepository.findByName).toHaveBeenCalledWith('Admin')
      expect(MockRoleRepository.update).not.toHaveBeenCalled()
    })
  })

  describe('executeDelete', () => {
    it('should delete role successfully when not associated to users', async () => {
      const roleId = faker.string.uuid()
      const existingRole: Role = {
        id: roleId,
        name: 'Editor',
        description: faker.lorem.sentence(),
        isActive: true,
        createdAt: faker.date.past(),
        updatedAt: faker.date.past()
      }

      MockRoleRepository.findById.mockResolvedValue(existingRole)
      MockRoleRepository.countProfessionalsWithRole.mockResolvedValue(0)
      MockRoleRepository.delete.mockResolvedValue(existingRole)

      const result = await roleUseCase.executeDelete(roleId)

      expect(result).toEqual(existingRole)
      expect(MockRoleRepository.findById).toHaveBeenCalledWith(roleId)
      expect(MockRoleRepository.countProfessionalsWithRole).toHaveBeenCalledWith(roleId)
      expect(MockRoleRepository.delete).toHaveBeenCalledWith(roleId)
    })

    it('should throw error when trying to delete role associated to users', async () => {
      const roleId = faker.string.uuid()
      const existingRole: Role = {
        id: roleId,
        name: 'Admin',
        description: faker.lorem.sentence(),
        isActive: true,
        createdAt: faker.date.past(),
        updatedAt: faker.date.past()
      }

      MockRoleRepository.findById.mockResolvedValue(existingRole)
      MockRoleRepository.countProfessionalsWithRole.mockResolvedValue(2)

      const promise = roleUseCase.executeDelete(roleId)

      await expect(promise).rejects.toThrow('Não é possível excluir uma role que está sendo utilizada por profissionais')
      expect(MockRoleRepository.findById).toHaveBeenCalledWith(roleId)
      expect(MockRoleRepository.countProfessionalsWithRole).toHaveBeenCalledWith(roleId)
      expect(MockRoleRepository.delete).not.toHaveBeenCalled()
    })
  })

  describe('executeFindRoleAssociations', () => {
    it('should return role associations with all types when no filter', async () => {
      const roleId = faker.string.uuid()
      const permissions: Permission[] = [
        {
          id: faker.string.uuid(),
          resource: 'users',
          action: 'read',
          description: 'Can read users',
          createdAt: faker.date.past(),
          updatedAt: faker.date.past()
        }
      ]
      const professionals: Professional[] = [
        {
          id: faker.string.uuid(),
          name: faker.person.fullName(),
          email: faker.internet.email(),
          googleId: null,
          registerCompleted: true,
          paymentMethods: null,
          socialMedia: null,
          passwordHash: null,
          contact: faker.phone.number(),
          specialization: null,
          profilePhotoUrl: null,
          userType: 'PROFESSIONAL',
          notificationPreference: NotificationChannel.ALL,
          isCommissioned: false,
          commissionRate: null,
          createdAt: faker.date.past(),
          updatedAt: faker.date.past()
        }
      ]

      const mockAssociations = {
        permissions,
        professionals,
        totalPermissions: 1,
        totalProfessionals: 1
      }

      const mockPaginatedResult = {
        data: [mockAssociations],
        total: 1,
        page: 1,
        totalPages: 1,
        limit: 10
      }

      MockRoleRepository.findById.mockResolvedValue({
        id: roleId,
        name: 'Admin',
        description: 'Admin role',
        isActive: true,
        createdAt: faker.date.past(),
        updatedAt: faker.date.past()
      })
      MockRoleRepository.findRoleAssociations.mockResolvedValue(mockPaginatedResult)

      const result = await roleUseCase.executeFindRoleAssociations(roleId, {
        page: 1,
        limit: 10,
        filters: { type: 'all' }
      })

      expect(result).toEqual(mockPaginatedResult)
      expect(MockRoleRepository.findById).toHaveBeenCalledWith(roleId)
      expect(MockRoleRepository.findRoleAssociations).toHaveBeenCalledWith(roleId, {
        page: 1,
        limit: 10,
        filters: { type: 'all' }
      })
    })

    it('should return only permissions when type filter is permission', async () => {
      const roleId = faker.string.uuid()
      const permissions: Permission[] = [
        {
          id: faker.string.uuid(),
          resource: 'users',
          action: 'read',
          description: 'Can read users',
          createdAt: faker.date.past(),
          updatedAt: faker.date.past()
        }
      ]

      const mockAssociations = {
        permissions,
        professionals: [],
        totalPermissions: 1,
        totalProfessionals: 0
      }

      const mockPaginatedResult = {
        data: [mockAssociations],
        total: 1,
        page: 1,
        totalPages: 1,
        limit: 10
      }

      MockRoleRepository.findById.mockResolvedValue({
        id: roleId,
        name: 'Admin',
        description: 'Admin role',
        isActive: true,
        createdAt: faker.date.past(),
        updatedAt: faker.date.past()
      })
      MockRoleRepository.findRoleAssociations.mockResolvedValue(mockPaginatedResult)

      const result = await roleUseCase.executeFindRoleAssociations(roleId, {
        page: 1,
        limit: 10,
        filters: { type: 'permission' }
      })

      expect(result).toEqual(mockPaginatedResult)
      expect(MockRoleRepository.findRoleAssociations).toHaveBeenCalledWith(roleId, {
        page: 1,
        limit: 10,
        filters: { type: 'permission' }
      })
    })

    it('should throw error when role is not found', async () => {
      const roleId = faker.string.uuid()

      MockRoleRepository.findById.mockResolvedValue(null)

      const promise = roleUseCase.executeFindRoleAssociations(roleId, {
        page: 1,
        limit: 10,
        filters: {}
      })

      await expect(promise).rejects.toBeInstanceOf(CustomError)
      expect(MockRoleRepository.findById).toHaveBeenCalledWith(roleId)
      expect(MockRoleRepository.findRoleAssociations).not.toHaveBeenCalled()
    })
  })

  describe('executeAddPermissionToRole', () => {
    it('should add permission to role successfully', async () => {
      const roleId = faker.string.uuid()
      const permissionId = faker.string.uuid()

      const role: Role = {
        id: roleId,
        name: 'Admin',
        description: 'Admin role',
        isActive: true,
        createdAt: faker.date.past(),
        updatedAt: faker.date.past()
      }

      const permission: Permission = {
        id: permissionId,
        resource: 'users',
        action: 'read',
        description: 'Can read users',
        createdAt: faker.date.past(),
        updatedAt: faker.date.past()
      }

      MockRoleRepository.findById.mockResolvedValue(role)
      MockRoleRepository.findPermissionById.mockResolvedValue(permission)
      MockRoleRepository.findRolePermissionAssociation.mockResolvedValue(false)
      MockRoleRepository.addPermissionToRole.mockResolvedValue()

      await roleUseCase.executeAddPermissionToRole(roleId, permissionId)

      expect(MockRoleRepository.findById).toHaveBeenCalledWith(roleId)
      expect(MockRoleRepository.findPermissionById).toHaveBeenCalledWith(permissionId)
      expect(MockRoleRepository.findRolePermissionAssociation).toHaveBeenCalledWith(roleId, permissionId)
      expect(MockRoleRepository.addPermissionToRole).toHaveBeenCalledWith(roleId, permissionId)
    })

    it('should throw error when role is not found', async () => {
      const roleId = faker.string.uuid()
      const permissionId = faker.string.uuid()

      MockRoleRepository.findById.mockResolvedValue(null)

      const promise = roleUseCase.executeAddPermissionToRole(roleId, permissionId)

      await expect(promise).rejects.toBeInstanceOf(CustomError)
      expect(MockRoleRepository.findById).toHaveBeenCalledWith(roleId)
      expect(MockRoleRepository.findPermissionById).not.toHaveBeenCalled()
    })

    it('should throw error when permission is not found', async () => {
      const roleId = faker.string.uuid()
      const permissionId = faker.string.uuid()

      const role: Role = {
        id: roleId,
        name: 'Admin',
        description: 'Admin role',
        isActive: true,
        createdAt: faker.date.past(),
        updatedAt: faker.date.past()
      }

      MockRoleRepository.findById.mockResolvedValue(role)
      MockRoleRepository.findPermissionById.mockResolvedValue(null)

      const promise = roleUseCase.executeAddPermissionToRole(roleId, permissionId)

      await expect(promise).rejects.toBeInstanceOf(CustomError)
      expect(MockRoleRepository.findById).toHaveBeenCalledWith(roleId)
      expect(MockRoleRepository.findPermissionById).toHaveBeenCalledWith(permissionId)
      expect(MockRoleRepository.findRolePermissionAssociation).not.toHaveBeenCalled()
    })

    it('should throw error when permission is already associated', async () => {
      const roleId = faker.string.uuid()
      const permissionId = faker.string.uuid()

      const role: Role = {
        id: roleId,
        name: 'Admin',
        description: 'Admin role',
        isActive: true,
        createdAt: faker.date.past(),
        updatedAt: faker.date.past()
      }

      const permission: Permission = {
        id: permissionId,
        resource: 'users',
        action: 'read',
        description: 'Can read users',
        createdAt: faker.date.past(),
        updatedAt: faker.date.past()
      }

      MockRoleRepository.findById.mockResolvedValue(role)
      MockRoleRepository.findPermissionById.mockResolvedValue(permission)
      MockRoleRepository.findRolePermissionAssociation.mockResolvedValue(true)

      const promise = roleUseCase.executeAddPermissionToRole(roleId, permissionId)

      await expect(promise).rejects.toBeInstanceOf(CustomError)
      expect(MockRoleRepository.findById).toHaveBeenCalledWith(roleId)
      expect(MockRoleRepository.findPermissionById).toHaveBeenCalledWith(permissionId)
      expect(MockRoleRepository.findRolePermissionAssociation).toHaveBeenCalledWith(roleId, permissionId)
      expect(MockRoleRepository.addPermissionToRole).not.toHaveBeenCalled()
    })
  })

  describe('executeRemovePermissionFromRole', () => {
    it('should remove permission from role successfully', async () => {
      const roleId = faker.string.uuid()
      const permissionId = faker.string.uuid()

      const role: Role = {
        id: roleId,
        name: 'Admin',
        description: 'Admin role',
        isActive: true,
        createdAt: faker.date.past(),
        updatedAt: faker.date.past()
      }

      const permission: Permission = {
        id: permissionId,
        resource: 'users',
        action: 'read',
        description: 'Can read users',
        createdAt: faker.date.past(),
        updatedAt: faker.date.past()
      }

      MockRoleRepository.findById.mockResolvedValue(role)
      MockRoleRepository.findPermissionById.mockResolvedValue(permission)
      MockRoleRepository.findRolePermissionAssociation.mockResolvedValue(true)
      MockRoleRepository.removePermissionFromRole.mockResolvedValue()

      await roleUseCase.executeRemovePermissionFromRole(roleId, permissionId)

      expect(MockRoleRepository.findById).toHaveBeenCalledWith(roleId)
      expect(MockRoleRepository.findPermissionById).toHaveBeenCalledWith(permissionId)
      expect(MockRoleRepository.findRolePermissionAssociation).toHaveBeenCalledWith(roleId, permissionId)
      expect(MockRoleRepository.removePermissionFromRole).toHaveBeenCalledWith(roleId, permissionId)
    })

    it('should throw error when role is not found', async () => {
      const roleId = faker.string.uuid()
      const permissionId = faker.string.uuid()

      MockRoleRepository.findById.mockResolvedValue(null)

      const promise = roleUseCase.executeRemovePermissionFromRole(roleId, permissionId)

      await expect(promise).rejects.toBeInstanceOf(CustomError)
      expect(MockRoleRepository.findById).toHaveBeenCalledWith(roleId)
      expect(MockRoleRepository.findPermissionById).not.toHaveBeenCalled()
    })

    it('should throw error when permission is not found', async () => {
      const roleId = faker.string.uuid()
      const permissionId = faker.string.uuid()

      const role: Role = {
        id: roleId,
        name: 'Admin',
        description: 'Admin role',
        isActive: true,
        createdAt: faker.date.past(),
        updatedAt: faker.date.past()
      }

      MockRoleRepository.findById.mockResolvedValue(role)
      MockRoleRepository.findPermissionById.mockResolvedValue(null)

      const promise = roleUseCase.executeRemovePermissionFromRole(roleId, permissionId)

      await expect(promise).rejects.toBeInstanceOf(CustomError)
      expect(MockRoleRepository.findById).toHaveBeenCalledWith(roleId)
      expect(MockRoleRepository.findPermissionById).toHaveBeenCalledWith(permissionId)
      expect(MockRoleRepository.findRolePermissionAssociation).not.toHaveBeenCalled()
    })

    it('should throw error when permission is not associated', async () => {
      const roleId = faker.string.uuid()
      const permissionId = faker.string.uuid()

      const role: Role = {
        id: roleId,
        name: 'Admin',
        description: 'Admin role',
        isActive: true,
        createdAt: faker.date.past(),
        updatedAt: faker.date.past()
      }

      const permission: Permission = {
        id: permissionId,
        resource: 'users',
        action: 'read',
        description: 'Can read users',
        createdAt: faker.date.past(),
        updatedAt: faker.date.past()
      }

      MockRoleRepository.findById.mockResolvedValue(role)
      MockRoleRepository.findPermissionById.mockResolvedValue(permission)
      MockRoleRepository.findRolePermissionAssociation.mockResolvedValue(false)

      const promise = roleUseCase.executeRemovePermissionFromRole(roleId, permissionId)

      await expect(promise).rejects.toBeInstanceOf(CustomError)
      expect(MockRoleRepository.findById).toHaveBeenCalledWith(roleId)
      expect(MockRoleRepository.findPermissionById).toHaveBeenCalledWith(permissionId)
      expect(MockRoleRepository.findRolePermissionAssociation).toHaveBeenCalledWith(roleId, permissionId)
      expect(MockRoleRepository.removePermissionFromRole).not.toHaveBeenCalled()
    })
  })
})
