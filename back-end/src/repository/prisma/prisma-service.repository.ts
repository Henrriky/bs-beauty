import { type Prisma } from '@prisma/client'
import { prismaClient } from '../../lib/prisma'
import { type ServiceRepository } from '../protocols/service.repository'

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

  public async fetchEmployeesOfferingService (serviceId: string) {
    const employeesOfferingService = await prismaClient.service.findUnique({
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
            employee: {
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

    return { employeesOfferingService }
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
}

export { PrismaServiceRepository }
