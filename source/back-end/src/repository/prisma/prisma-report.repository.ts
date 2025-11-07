import { type Prisma } from '@prisma/client'
import { type ReportRepository } from '../protocols/report.repository'
import { prismaClient } from '@/lib/prisma'

class PrismaReportRepository implements ReportRepository {
  public async getDiscoverySourceCount(startDate?: Date, endDate?: Date) {
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

  public async getCustomerAgeDistribution(startDate?: Date, endDate?: Date) {
    const where: Prisma.CustomerWhereInput = {
      birthdate: { not: null }
    }

    if (startDate ?? endDate) {
      where.createdAt = {
        gte: startDate,
        lte: endDate
      }
    }

    const customers = await prismaClient.customer.findMany({
      where,
      select: {
        birthdate: true
      }
    })

    const ageRanges = {
      'Jovens (13-24)': 0,
      'Adultos jovens (25-39)': 0,
      'Adultos maduros (40-59)': 0,
      'Idosos (60+)': 0
    }

    customers.forEach(customer => {
      if (customer.birthdate) {
        const age = Math.floor((Date.now() - customer.birthdate.getTime()) / (365.25 * 24 * 60 * 60 * 1000))

        if (age >= 13 && age <= 24) {
          ageRanges['Jovens (13-24)']++
        } else if (age >= 25 && age <= 39) {
          ageRanges['Adultos jovens (25-39)']++
        } else if (age >= 40 && age <= 59) {
          ageRanges['Adultos maduros (40-59)']++
        } else if (age >= 60) {
          ageRanges['Idosos (60+)']++
        }
      }
    })

    const report = Object.entries(ageRanges).map(([ageRange, count]) => ({
      ageRange,
      count
    }))

    return report
  }

  public async getRevenueEvolution(startDate: Date, endDate: Date, professionalId?: string) {
    const where: Prisma.PaymentRecordWhereInput = {
      createdAt: {
        gte: startDate,
        lte: endDate
      }
    }

    if (professionalId) {
      where.professionalId = professionalId
    }

    const payments = await prismaClient.paymentRecord.findMany({
      where,
      select: {
        createdAt: true,
        totalValue: true
      },
      orderBy: {
        createdAt: 'asc'
      }
    })

    const daysDiff = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))

    let groupingFormat: string
    if (daysDiff <= 31) {
      groupingFormat = 'day'
    } else if (daysDiff <= 90) {
      groupingFormat = 'week'
    } else {
      groupingFormat = 'month'
    }

    const revenueMap = new Map<string, number>()

    payments.forEach(payment => {
      let key: string
      const date = new Date(payment.createdAt)

      if (groupingFormat === 'day') {
        key = date.toISOString().split('T')[0]
      } else if (groupingFormat === 'week') {
        const weekStart = new Date(date)
        weekStart.setDate(date.getDate() - date.getDay())
        key = weekStart.toISOString().split('T')[0]
      } else {
        key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
      }

      const currentValue = revenueMap.get(key) || 0
      revenueMap.set(key, currentValue + Number(payment.totalValue))
    })

    const report = Array.from(revenueMap.entries())
      .map(([date, totalValue]) => ({
        date,
        totalValue: Math.round(totalValue * 100) / 100
      }))
      .sort((a, b) => a.date.localeCompare(b.date))

    return report
  }
}

export { PrismaReportRepository }
