import { type DiscoverySource } from '@prisma/client'

interface ReportRepository {
  // Customer Reports
  getDiscoverySourceCount: (startDate?: Date, endDate?: Date) => Promise<Array<{ source: DiscoverySource | null, count: number }>>
  // Financial Reports
  // Occupancy Reports
}

export type { ReportRepository }
