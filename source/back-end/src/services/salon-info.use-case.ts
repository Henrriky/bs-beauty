import { type SalonInfoRepository } from '@/repository/protocols/salon-info.repository'
import { type Prisma, type SalonInfo } from '@prisma/client'

class SalonInfoUseCase {
  constructor (private readonly salonSettingsRepository: SalonInfoRepository) { }

  public async executeFetchInfo (id: number): Promise<SalonInfo | null> {
    const salonInfo = await this.salonSettingsRepository.fetchInfo(id)

    return salonInfo
  }

  public async executeUpdateInfo (id: number, data: Prisma.SalonInfoUpdateInput) {
    const updatedSalonInfo = await this.salonSettingsRepository.updateInfo(id, data)

    return updatedSalonInfo
  }
}

export { SalonInfoUseCase }
