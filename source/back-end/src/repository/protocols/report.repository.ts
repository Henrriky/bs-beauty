import { type DiscoverySource } from '@prisma/client'

interface ReportRepository {
  // Customer Reports
  getDiscoverySourceCount: (startDate?: Date, endDate?: Date) => Promise<Array<{ source: DiscoverySource | null, count: number }>>
  getCustomerAgeDistribution: (startDate?: Date, endDate?: Date) => Promise<Array<{ ageRange: string, count: number }>>
  getNewCustomersCount: (startDate: Date, endDate: Date) => Promise<{ totalCustomers: number }>
  // Financial Reports
  getRevenueEvolution: (startDate: Date, endDate: Date, professionalId?: string) => Promise<Array<{ date: string, totalValue: number }>>
  getTotalRevenue: (startDate: Date, endDate: Date, professionalId?: string) => Promise<{ totalRevenue: number, transactionCount: number }>
  getRevenueByService: (startDate: Date, endDate: Date, professionalId?: string) => Promise<Array<{ serviceId: string, serviceName: string, category: string, totalRevenue: number, quantity: number }>>
  getRevenueByProfessional: (startDate: Date, endDate: Date) => Promise<Array<{ professionalId: string, professionalName: string, totalRevenue: number, transactionCount: number }>>
  // Occupancy Reports
  getOccupancyRate: (startDate: Date, endDate: Date, professionalId?: string) => Promise<{ occupancyRate: number, occupiedMinutes: number, availableMinutes: number }>
  getIdleRate: (startDate: Date, endDate: Date, professionalId?: string) => Promise<{ idleRate: number, idleMinutes: number, availableMinutes: number }>
}

export type { ReportRepository }
