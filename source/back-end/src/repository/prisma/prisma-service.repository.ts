import { type Prisma } from '@prisma/client'
import { prismaClient } from '../../lib/prisma'
import { type ServiceRepository } from '../protocols/service.repository'
import { type PaginatedRequest } from '../../types/pagination'
import { type PartialServiceQuerySchema } from '@/utils/validation/zod-schemas/pagination/services/services-query.schema'

class PrismaServiceRepository implements ServiceRepository {
  public async findAll () {
    const services = await prismaClient.service.findMany()
    return services
  }

  public async findById (serviceId: string) {
    const service = await prismaClient.service.findUnique({
      where: {
        id: serviceId
      }
    })

    return service
  }

  public async fetchProfessionalsOfferingService (serviceId: string) {
    const professionalsOfferingService = await prismaClient.service.findUnique({
      where: {
        id: serviceId
      },
      select: {
        id: true,
        offers: {
          where: {
            isOffering: true
          },
          select: {
            id: true,
            estimatedTime: true,
            price: true,
            professional: {
              select: {
                id: true,
                name: true,
                specialization: true,
                profilePhotoUrl: true
              }
            }
          }
        }
      }
    })

    return { professionalsOfferingService }
  }

  public async create (newService: Prisma.ServiceCreateInput) {
    const service = await prismaClient.service.create({
      data: { ...newService }
    })
    return service
  }

  public async update (serviceId: string, updatedService: Prisma.ServiceUpdateInput) {
    const service = await prismaClient.service.update({
      where: {
        id: serviceId
      },
      data: { ...updatedService }
    })
    return service
  }

  public async delete (serviceId: string) {
    const service = await prismaClient.service.delete({
      where: {
        id: serviceId
      }
    })
    return service
  }

  public async findAllPaginated (
    params: PaginatedRequest<PartialServiceQuerySchema>
  ) {
    const { page, limit, filters } = params
    const skip = (page - 1) * limit

    const where: Prisma.ServiceWhereInput = {
      name: (filters.name != null) ? { contains: filters.name } : undefined,
      category: (filters.category != null) ? { contains: filters.category } : undefined,
      OR: (filters.q != null)
        ? [
            {
              name: {
                contains: filters.q
              }
            },
            {
              description: {
                contains: filters.q
              }
            },
            {
              offers: {
                some: {
                  professional: {
                    name: {
                      contains: filters.q
                    }
                  }
                }
              }
            }
          ]
        : undefined
    }

    const [data, total] = await Promise.all([
      prismaClient.service.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'asc' },
        where
      }),
      prismaClient.service.count({ where })
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

export { PrismaServiceRepository }
