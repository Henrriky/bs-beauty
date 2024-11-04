import { prismaClient } from '../../lib/prisma'
import { type ServiceRepository } from '../protocols/service.repository'

class PrismaServiceRepository implements ServiceRepository {
  public async fetchAll () {
    const services = await prismaClient.service.findMany()

    return services
  }
}

export { PrismaServiceRepository }
