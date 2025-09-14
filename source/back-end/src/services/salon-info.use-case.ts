import { SalonSettingsRepository } from '@/repository/protocols/salon-settings.repository'
import { Prisma, SalonSettings } from '@prisma/client'

class SalonSettingsUseCase {
  constructor(private readonly salonSettingsRepository: SalonSettingsRepository) { }

  public async executeFetchInfo(id: number): Promise<SalonSettings | null> {
    const salonInfo = await this.salonSettingsRepository.fetchInfo(id)

    return salonInfo
  }

  public async executeUpdateInfo(id: number, data: Prisma.SalonSettingsUpdateInput) {
    const updatedSalonInfo = await this.salonSettingsRepository.updateInfo(id, data)

    return updatedSalonInfo
  }
}

export { SalonSettingsUseCase }
