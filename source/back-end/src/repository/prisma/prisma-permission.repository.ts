import { type Permission } from '@prisma/client'
import { type PaginatedRequest, type PaginatedResult } from '@/types/pagination'
import { type PermissionFilters } from '@/types/permissions/permission-filters'
import { type PermissionRepository } from '../protocols/permission.repository'
import { prismaClient } from '@/lib/prisma'

class PrismaPermissionRepository implements PermissionRepository {
  public async findAllPaginated (params: PaginatedRequest<PermissionFilters>): Promise<PaginatedResult<Permission>> {
    const { page, limit, filters } = params
    const skip = (page - 1) * limit

    // Construir where clause baseado nos filtros
    const where: any = {}

    // Filtro por resource
    if (filters.resource != null && filters.resource.length > 0) {
      where.resource = {
        contains: filters.resource
      }
    }

    // Filtro por action
    if (filters.action != null && filters.action.length > 0) {
      where.action = {
        contains: filters.action
      }
    }

    // Busca textual em description ou resource.action (RN-16)
    if (filters.search != null && filters.search.length > 0) {
      where.OR = [
        {
          description: {
            contains: filters.search
          }
        },
        {
          // Busca na concatenação resource.action usando raw SQL
          // Prisma não suporta concatenação diretamente no where, então fazemos por description e resource/action
          resource: {
            contains: filters.search
          }
        },
        {
          action: {
            contains: filters.search
          }
        }
      ]
    }

    // Executar queries em paralelo para performance
    const [permissions, total] = await Promise.all([
      prismaClient.permission.findMany({
        where,
        skip,
        take: limit,
        orderBy: [
          { resource: 'asc' },
          { action: 'asc' }
        ]
      }),
      prismaClient.permission.count({
        where
      })
    ])

    return {
      data: permissions,
      total,
      page,
      totalPages: Math.ceil(total / limit),
      limit
    }
  }
}

export { PrismaPermissionRepository }
