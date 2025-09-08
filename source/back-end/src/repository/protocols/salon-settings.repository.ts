import { Prisma, SalonSettings } from '@prisma/client';

interface SalonSettingsRepository {
  fetchInfo: (id: number) => Promise<SalonSettings | null>
  updateInfo: (id: number, data: Prisma.SalonSettingsUpdateInput) => Promise<SalonSettings>
}

export type { SalonSettingsRepository }
