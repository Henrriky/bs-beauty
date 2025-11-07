import { type DiscoverySource } from '@prisma/client'

interface ReportRepository {
  // Customer Reports
  getDiscoverySourceCount: (startDate?: Date, endDate?: Date) => Promise<Array<{ source: DiscoverySource | null, count: number }>>
  getCustomerAgeDistribution: (startDate?: Date, endDate?: Date) => Promise<Array<{ ageRange: string, count: number }>>
  // Financial Reports
  getRevenueEvolution: (startDate: Date, endDate: Date, professionalId?: string) => Promise<Array<{ date: string, totalValue: number }>>
  // Occupancy Reports
}

export type { ReportRepository }
