import { type Prisma, type SalonInfo } from '@prisma/client'

interface SalonInfoRepository {
  fetchInfo: (id: number) => Promise<SalonInfo | null>
  updateInfo: (id: number, data: Prisma.SalonInfoUpdateInput) => Promise<SalonInfo>
}

export type { SalonInfoRepository }
