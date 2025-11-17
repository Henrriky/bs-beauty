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

  public async getTotalRevenue(startDate: Date, endDate: Date, professionalId?: string) {
    const where: Prisma.PaymentRecordWhereInput = {
      createdAt: {
        gte: startDate,
        lte: endDate
      }
    }

    if (professionalId) {
      where.professionalId = professionalId
    }

    const result = await prismaClient.paymentRecord.aggregate({
      where,
      _sum: {
        totalValue: true
      },
      _count: true
    })

    return {
      totalRevenue: result._sum.totalValue ? Math.round(Number(result._sum.totalValue) * 100) / 100 : 0,
      transactionCount: result._count
    }
  }

  public async getRevenueByService(startDate: Date, endDate: Date, professionalId?: string) {
    const paymentRecordWhere: Prisma.PaymentRecordWhereInput = {
      createdAt: {
        gte: startDate,
        lte: endDate
      }
    }

    if (professionalId) {
      paymentRecordWhere.professionalId = professionalId
    }

    const where: Prisma.PaymentItemWhereInput = {
      paymentRecord: paymentRecordWhere
    }

    const paymentItems = await prismaClient.paymentItem.findMany({
      where,
      include: {
        offer: {
          include: {
            service: true
          }
        }
      }
    })

    const revenueMap = new Map<string, {
      serviceId: string
      serviceName: string
      category: string
      totalRevenue: number
      quantity: number
    }>()

    paymentItems.forEach(item => {
      const serviceId = item.offer.service.id
      const existing = revenueMap.get(serviceId)

      if (existing) {
        existing.totalRevenue += Number(item.price) * item.quantity
        existing.quantity += item.quantity
      } else {
        revenueMap.set(serviceId, {
          serviceId,
          serviceName: item.offer.service.name,
          category: item.offer.service.category,
          totalRevenue: Number(item.price) * item.quantity,
          quantity: item.quantity
        })
      }
    })

    const report = Array.from(revenueMap.values())
      .map(item => ({
        ...item,
        totalRevenue: Math.round(item.totalRevenue * 100) / 100
      }))
      .sort((a, b) => b.totalRevenue - a.totalRevenue)

    return report
  }

  public async getRevenueByProfessional(startDate: Date, endDate: Date) {
    const payments = await prismaClient.paymentRecord.groupBy({
      by: ['professionalId'],
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate
        }
      },
      _sum: {
        totalValue: true
      },
      _count: true
    })

    const professionalIds = payments.map(p => p.professionalId)
    const professionals = await prismaClient.professional.findMany({
      where: {
        id: {
          in: professionalIds
        }
      },
      select: {
        id: true,
        name: true
      }
    })

    const professionalMap = new Map(professionals.map(p => [p.id, p.name || 'Sem nome']))

    const report = payments
      .map(payment => ({
        professionalId: payment.professionalId,
        professionalName: professionalMap.get(payment.professionalId) || 'Desconhecido',
        totalRevenue: payment._sum.totalValue ? Math.round(Number(payment._sum.totalValue) * 100) / 100 : 0,
        transactionCount: payment._count
      }))
      .sort((a, b) => b.totalRevenue - a.totalRevenue)

    return report
  }

  public async getNewCustomersCount(startDate: Date, endDate: Date) {
    const count = await prismaClient.customer.count({
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate
        }
      }
    })

    return {
      totalCustomers: count
    }
  }

  public async getOccupancyRate(startDate: Date, endDate: Date, professionalId?: string): Promise<{ occupancyRate: number, occupiedMinutes: number, availableMinutes: number }> {
    const shifts = await prismaClient.shift.findMany({
      where: {
        ...(professionalId && { professionalId })
      },
      select: {
        id: true,
        shiftStart: true,
        shiftEnd: true,
        weekDay: true,
        professionalId: true
      }
    })

    console.log('Shifts fetched:', shifts.length)

    const appointments = await prismaClient.appointment.findMany({
      where: {
        appointmentDate: {
          gte: startDate,
          lte: endDate
        },
        status: {
          in: ['CONFIRMED', 'FINISHED']
        },
        ...(professionalId && {
          offer: {
            professionalId
          }
        })
      },
      include: {
        offer: {
          select: {
            estimatedTime: true,
            professionalId: true
          }
        }
      }
    })

    let totalAvailableMinutes = 0
    let totalOccupiedMinutes = 0

    const weekDayMap: Record<string, number> = {
      SUNDAY: 0,
      MONDAY: 1,
      TUESDAY: 2,
      WEDNESDAY: 3,
      THURSDAY: 4,
      FRIDAY: 5,
      SATURDAY: 6
    }

    const currentDate = new Date(startDate)
    while (currentDate <= endDate) {
      const dayOfWeek = currentDate.getDay()

      const dayShifts = shifts.filter(shift => weekDayMap[shift.weekDay] === dayOfWeek)

      for (const shift of dayShifts) {
        const shiftStart = new Date(shift.shiftStart)
        const shiftEnd = new Date(shift.shiftEnd)
        const shiftDurationMinutes = (shiftEnd.getTime() - shiftStart.getTime()) / (1000 * 60)
        totalAvailableMinutes += shiftDurationMinutes

        const dayAppointments = appointments.filter(apt => {
          const aptDate = new Date(apt.appointmentDate)
          return aptDate.toDateString() === currentDate.toDateString() &&
            apt.offer.professionalId === shift.professionalId
        })

        for (const apt of dayAppointments) {
          totalOccupiedMinutes += apt.offer.estimatedTime
        }
      }

      currentDate.setDate(currentDate.getDate() + 1)
    }

    const occupancyRate = totalAvailableMinutes > 0
      ? (totalOccupiedMinutes / totalAvailableMinutes) * 100
      : 0

    return {
      occupancyRate: Math.round(occupancyRate * 100) / 100,
      occupiedMinutes: totalOccupiedMinutes,
      availableMinutes: totalAvailableMinutes
    }
  }

  public async getIdleRate(startDate: Date, endDate: Date, professionalId?: string): Promise<{ idleRate: number, idleMinutes: number, availableMinutes: number }> {
    const shifts = await prismaClient.shift.findMany({
      where: {
        isBusy: false,
        ...(professionalId && { professionalId })
      },
      select: {
        shiftStart: true,
        shiftEnd: true,
        weekDay: true
      }
    })

    let totalAvailableMinutes = 0
    let totalIdleMinutes = 0

    const weekDayMap: Record<string, number> = {
      SUNDAY: 0,
      MONDAY: 1,
      TUESDAY: 2,
      WEDNESDAY: 3,
      THURSDAY: 4,
      FRIDAY: 5,
      SATURDAY: 6
    }

    const allShifts = await prismaClient.shift.findMany({
      where: {
        ...(professionalId && { professionalId })
      },
      select: {
        shiftStart: true,
        shiftEnd: true,
        weekDay: true
      }
    })

    const currentDate = new Date(startDate)
    while (currentDate <= endDate) {
      const dayOfWeek = currentDate.getDay()

      const dayAllShifts = allShifts.filter(shift => weekDayMap[shift.weekDay] === dayOfWeek)
      for (const shift of dayAllShifts) {
        const shiftStart = new Date(shift.shiftStart)
        const shiftEnd = new Date(shift.shiftEnd)
        const shiftDurationMinutes = (shiftEnd.getTime() - shiftStart.getTime()) / (1000 * 60)
        totalAvailableMinutes += shiftDurationMinutes
      }

      const dayIdleShifts = shifts.filter(shift => weekDayMap[shift.weekDay] === dayOfWeek)
      for (const shift of dayIdleShifts) {
        const shiftStart = new Date(shift.shiftStart)
        const shiftEnd = new Date(shift.shiftEnd)
        const shiftDurationMinutes = (shiftEnd.getTime() - shiftStart.getTime()) / (1000 * 60)
        totalIdleMinutes += shiftDurationMinutes
      }

      currentDate.setDate(currentDate.getDate() + 1)
    }

    const idleRate = totalAvailableMinutes > 0
      ? (totalIdleMinutes / totalAvailableMinutes) * 100
      : 0

    return {
      idleRate: Math.round(idleRate * 100) / 100,
      idleMinutes: totalIdleMinutes,
      availableMinutes: totalAvailableMinutes
    }
  }
}

export { PrismaReportRepository }
