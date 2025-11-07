import { type Prisma } from '@prisma/client'
import { type ReportRepository } from '../protocols/report.repository'
import { prismaClient } from '@/lib/prisma'

class PrismaReportRepository implements ReportRepository {
  public async getDiscoverySourceCount (startDate?: Date, endDate?: Date) {
    const where: Prisma.CustomerWhereInput = {}

    if (startDate ?? endDate) {
      where.createdAt = {
        gte: startDate,
        lte: endDate
      }
    }

    const data = await prismaClient.customer.groupBy({
      by: ['discoverySource'],
      _count: {
        discoverySource: true
      },
      where
    })

    const report = data.map(item => ({
      source: item.discoverySource,
      count: item._count.discoverySource
    }))

    return report
  }
}

export { PrismaReportRepository }
