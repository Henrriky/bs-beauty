import { SalonSettings, Prisma } from '@prisma/client'
import { SalonSettingsRepository } from '../protocols/salon-settings.repository'
import { prismaClient } from '../../lib/prisma'

class PrismaSalonSettingsRepository implements SalonSettingsRepository {
  public async fetchInfo (id: number) {
    const salonInfo = await prismaClient.salonSettings.findUnique({
      where: { id }
    })

    return salonInfo
  }
  public async updateInfo(id: number, data: Prisma.SalonSettingsUpdateInput) {
    const updatedSalonInfo = await prismaClient.salonSettings.update({
      where: { id },
      data: { ...data }
    })

    return updatedSalonInfo
  }

}

export { PrismaSalonSettingsRepository }
