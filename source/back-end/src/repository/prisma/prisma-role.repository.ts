import { type Prisma, type Permission } from '@prisma/client'
import { prismaClient } from '../../lib/prisma'
import { type RoleRepository } from '../protocols/role.repository'
import { type PaginatedRequest, type PaginatedResult } from '../../types/pagination'
import { type RoleFilters } from '../../types/roles/role-filters'
import { type RoleAssociation, type RoleAssociationFilters } from '../../types/roles/role-associations'

class PrismaRoleRepository implements RoleRepository {
  public async findAllPaginated (params: PaginatedRequest<RoleFilters>): Promise<PaginatedResult<any>> {
    const { page, limit, filters } = params
    const skip = (page - 1) * limit

    const where: Prisma.RoleWhereInput = {}

    // Filtro por nome (case insensitive) - RN-8
    if (filters.name != null) {
      where.name = {
        contains: filters.name
      }
    }

    const [roles, total] = await Promise.all([
      prismaClient.role.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' }
      }),
      prismaClient.role.count({ where })
    ])

    return {
      data: roles,
      total,
      page,
      totalPages: Math.ceil(total / limit),
      limit
    }
  }

  public async findById (roleId: string) {
    const role = await prismaClient.role.findUnique({
      where: { id: roleId }
    })

    return role
  }

  public async findByName (name: string) {
    const role = await prismaClient.role.findUnique({
      where: { name }
    })

    return role
  }

  public async findRoleAssociations (roleId: string, params: PaginatedRequest<RoleAssociationFilters>): Promise<PaginatedResult<RoleAssociation>> {
    const { page, limit, filters } = params
    const skip = (page - 1) * limit

    const [permissions, professionals, totalPermissions, totalProfessionals] = await Promise.all([
      // Get permissions based on filter
      filters.type === 'professional'
        ? []
        : prismaClient.permission.findMany({
          where: {
            rolePermission: {
              some: { roleId }
            }
          },
          skip: filters.type === 'permission' ? skip : 0,
          take: filters.type === 'permission' ? limit : 1000
        }),
      // Get professionals based on filter
      filters.type === 'permission'
        ? []
        : prismaClient.professional.findMany({
          where: {
            professionalRole: {
              some: { roleId }
            }
          },
          skip: filters.type === 'professional' ? skip : 0,
          take: filters.type === 'professional' ? limit : 1000
        }),
      // Count total permissions
      prismaClient.permission.count({
        where: {
          rolePermission: {
            some: { roleId }
          }
        }
      }),
      // Count total professionals
      prismaClient.professional.count({
        where: {
          professionalRole: {
            some: { roleId }
          }
        }
      })
    ])

    const association: RoleAssociation = {
      permissions,
      professionals,
      totalPermissions,
      totalProfessionals
    }

    const total = filters.type === 'permission'
      ? totalPermissions
      : filters.type === 'professional'
        ? totalProfessionals
        : totalPermissions + totalProfessionals

    return {
      data: [association],
      total,
      page,
      totalPages: Math.ceil(total / limit),
      limit
    }
  }

  public async addPermissionToRole (roleId: string, permissionId: string): Promise<void> {
    await prismaClient.rolePermission.create({
      data: {
        roleId,
        permissionId
      }
    })
  }

  public async removePermissionFromRole (roleId: string, permissionId: string): Promise<void> {
    await prismaClient.rolePermission.deleteMany({
      where: {
        roleId,
        permissionId
      }
    })
  }

  public async findPermissionById (permissionId: string): Promise<Permission | null> {
    const permission = await prismaClient.permission.findUnique({
      where: { id: permissionId }
    })

    return permission
  }

  public async findRolePermissionAssociation (roleId: string, permissionId: string): Promise<boolean> {
    const rolePermission = await prismaClient.rolePermission.findFirst({
      where: {
        roleId,
        permissionId
      }
    })

    return rolePermission !== null
  }

  public async countProfessionalsWithRole (roleId: string): Promise<number> {
    return await prismaClient.professionalRole.count({
      where: {
        roleId
      }
    })
  }

  public async create (newRole: Prisma.RoleCreateInput) {
    const role = await prismaClient.role.create({
      data: newRole
    })

    return role
  }

  public async update (id: string, roleUpdated: Prisma.RoleUpdateInput) {
    const role = await prismaClient.role.update({
      where: { id },
      data: roleUpdated
    })

    return role
  }

  public async delete (id: string) {
    const role = await prismaClient.role.delete({
      where: { id }
    })

    return role
  }
}

export { PrismaRoleRepository }
