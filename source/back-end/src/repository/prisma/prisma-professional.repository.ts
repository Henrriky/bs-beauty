import { type Prisma, type Professional } from '@prisma/client'
import { prismaClient } from '../../lib/prisma'
import { type PaginatedRequest } from '../../types/pagination'
import { type ProfessionalRepository } from '../protocols/professional.repository'
import { type ProfessionalsFilters } from '@/types/professionals/professionals-filters'
import { type PartialHandleFetchServicesOfferedByProfessionalQuerySchema } from '@/utils/validation/zod-schemas/pagination/professionals/professionals-query.schema'
import { PrismaPermissionMapper } from './mapper/prisma-permission-mapper'
import { type Permissions } from '@/utils/auth/permissions-map.util'

class PrismaProfessionalRepository implements ProfessionalRepository {
  public async findAll () {
    const professionals = await prismaClient.professional.findMany({
      orderBy: { createdAt: 'asc' }
    })

    return professionals
  }

  public async findById (professionalId: string) {
    const professional = await prismaClient.professional.findUnique({
      where: { id: professionalId }
    })

    return professional
  }

  public async findByEmail (email: string) {
    const professional = await prismaClient.professional.findUnique({
      where: { email }
    })
    return professional
  }

  public async countByRoleId (roleId: string): Promise<number> {
    const associationsCount = await prismaClient.professionalRole.count({
      where: { roleId }
    })

    return associationsCount
  }

  public async addRoleToProfessional (professionalId: string, roleId: string): Promise<void> {
    await prismaClient.professionalRole.create({
      data: {
        professionalId,
        roleId
      }
    })
  }

  public async removeRoleFromProfessional (professionalId: string, roleId: string): Promise<void> {
    await prismaClient.professionalRole.deleteMany({
      where: {
        professionalId,
        roleId
      }
    })
  }

  public async findProfessionalRoleAssociation (professionalId: string, roleId: string): Promise<boolean> {
    const association = await prismaClient.professionalRole.findFirst({
      where: {
        professionalId,
        roleId
      }
    })

    return association !== null
  }

  public async findRolesByProfessionalId (professionalId: string) {
    const professionalRoles = await prismaClient.professionalRole.findMany({
      where: { professionalId },
      select: {
        id: true,
        role: true
      }
    })

    return professionalRoles
  }

  public async findProfessionalPermissions (professionalId: string) {
    const professionalPermissions = await prismaClient.professional.findUnique({
      where: {
        id: professionalId
      },
      select: {
        professionalRole: {
          select: {
            role: {
              select: {
                rolePermission: {
                  select: {
                    permission: true
                  }
                }
              }
            }
          }
        }
      }
    })

    const permissions = professionalPermissions?.professionalRole.flatMap(pr => pr.role.rolePermission.map(rp => rp.permission))

    const uniquePermissions = Array.from(new Set(permissions?.map(PrismaPermissionMapper.toDomain)))

    return uniquePermissions
  }

  public async findProfessionalsWithPermissionOrUserType (permission: Permissions, userType: string) {
    const [resource, action] = permission.split('.')

    const professionals = await prismaClient.professional.findMany({
      where: {
        OR: [
          {
            userType: userType as any
          },
          {
            professionalRole: {
              some: {
                role: {
                  rolePermission: {
                    some: {
                      permission: {
                        resource,
                        action
                      }
                    }
                  }
                }
              }
            }
          }
        ]
      }
    })

    return professionals
  }

  public async create (newProfessional: Prisma.ProfessionalCreateInput) {
    const professional = await prismaClient.professional.create({
      data: { ...newProfessional }
    })

    return professional
  }

  public async update (professionalId: string, professionalToUpdate: Prisma.ProfessionalUpdateInput) {
    const professionalUpdated = await prismaClient.professional.update({
      where: { id: professionalId },
      data: { ...professionalToUpdate }
    })

    return professionalUpdated
  }

  async updateByEmailAndGoogleId (
    googleId: string,
    email: string,
    professionalData: Prisma.ProfessionalUpdateInput
  ): Promise<Professional> {
    const professional = await prismaClient.professional.update({
      where: {
        email,
        googleId
      },
      data: {
        ...professionalData,
        registerCompleted: true
      }
    })

    return professional
  }

  public async updateProfessionalByEmail (email: string, professionalToUpdate: Prisma.ProfessionalUpdateInput) {
    const professionalUpdated = await prismaClient.professional.update({
      where: { email },
      data: { ...professionalToUpdate }
    })

    return professionalUpdated
  }

  public async delete (professionalId: string) {
    const professionalDeleted = await prismaClient.professional.delete({
      where: { id: professionalId }
    })

    return professionalDeleted
  }

  public async updateCommission (professionalId: string, commissionRate: number) {
    await prismaClient.professional.update({
      where: { id: professionalId },
      data: { commissionRate }
    })
  }

  public async fetchServicesOfferedByProfessional (professionalId: string, { page, limit, filters }: PaginatedRequest<PartialHandleFetchServicesOfferedByProfessionalQuerySchema>) {
    const skip = (page - 1) * limit

    const professionalWhere: Prisma.ProfessionalWhereUniqueInput = {
      id: professionalId
    }

    const offersWhere: Prisma.OfferWhereInput = {
      isOffering: true,
      ...(filters.category != null && filters.category !== '')
        ? { service: { category: filters.category } }
        : undefined,
      ...(filters.q != null && filters.q !== '')
        ? {
            OR: [
              {
                service: {
                  name: {
                    contains: filters.q
                  }
                }
              },
              {
                service: {
                  description: {
                    contains: filters.q
                  }
                }
              }
            ]
          }
        : undefined
    }

    const professional = await prismaClient.professional.findUnique({
      where: professionalWhere,
      select: {
        id: true,
        offers: {
          skip,
          take: limit,
          where: offersWhere,
          select: {
            id: true,
            estimatedTime: true,
            price: true,
            service: {
              select: {
                id: true,
                name: true,
                description: true,
                category: true
              }
            }
          }
        }
      }
    })

    if (professional == null) {
      throw new Error('Professional not found')
    }

    const mappedProfessional = {
      id: professional.id,
      offers: professional.offers.map(offer => ({
        id: offer.id,
        estimatedTime: offer.estimatedTime,
        price: offer.price,
        service: offer.service
      }))
    }

    return { professional: mappedProfessional }
  }

  public async findAllPaginated (
    params: PaginatedRequest<ProfessionalsFilters>
  ) {
    const { page, limit, filters } = params
    const skip = (page - 1) * limit

    const where = {
      name: ((filters?.name) != null) ? { contains: filters.name } : undefined,
      email: ((filters?.email) != null) ? { contains: filters.email } : undefined
    }

    const [data, total] = await Promise.all([
      prismaClient.professional.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'asc' }
      }),
      prismaClient.professional.count({ where })
    ])

    return {
      data,
      total,
      page,
      totalPages: Math.ceil(total / limit),
      limit
    }
  }
}

export { PrismaProfessionalRepository }
