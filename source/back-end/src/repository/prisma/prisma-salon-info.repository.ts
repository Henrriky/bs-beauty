import { type Prisma } from '@prisma/client'
import { type SalonInfoRepository } from '../protocols/salon-info.repository'
import { prismaClient } from '../../lib/prisma'

class PrismaSalonInfoRepository implements SalonInfoRepository {
  public async fetchInfo (id: number) {
    const salonInfo = await prismaClient.salonInfo.findUnique({
      where: { id }
    })

    return salonInfo
  }

  public async updateInfo (id: number, data: Prisma.SalonInfoUpdateInput) {
    const updatedSalonInfo = await prismaClient.salonInfo.update({
      where: { id },
      data: { ...data }
    })

    return updatedSalonInfo
  }
}

export { PrismaSalonInfoRepository }
