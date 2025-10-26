import { type AuthContext } from './../../types/shared/index'
import { type Prisma } from '@prisma/client'
import { prismaClient } from '../../lib/prisma'
import { type PaginatedRequest } from '../../types/pagination'
import { type BlockedTimesRepositoryFilters } from '@/types/blocked-times/blocked-times'
import { type BlockedTimeRepository } from '../protocols/blocked-times.repository'
import * as luxon from 'luxon'

class PrismaBlockedTimeRepository implements BlockedTimeRepository {
  public async findAllPaginated ({ extra }: AuthContext<PaginatedRequest<BlockedTimesRepositoryFilters>>) {
    const { page, limit, filters } = extra
    const skip = (page - 1) * limit

    const where: Prisma.BlockedTimeWhereInput = {}
    if (filters.reason != null) {
      where.reason = {
        contains: filters.reason
      }
    }

    if (filters.professionalId != null) {
      where.professionalId = filters.professionalId
    }

    const [blockedTimes, total] = await Promise.all([
      prismaClient.blockedTime.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          professional: {
            select: {
              name: true
            }
          }
        }
      }),
      prismaClient.blockedTime.count({ where })
    ])

    return {
      data: blockedTimes,
      total,
      page,
      totalPages: Math.ceil(total / limit),
      limit
    }
  }

  public async findById (id: string) {
    const blockedTime = await prismaClient.blockedTime.findUnique({
      where: { id }
    })

    return blockedTime
  }

  public async findByProfessionalAndPeriod (data: { professionalId: string, startDate: Date, endDate: Date }) {
    const weekDays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] as const
    const differenceInDays = luxon.DateTime.fromJSDate(data.endDate).diff(luxon.DateTime.fromJSDate(data.startDate), 'days').days

    const weekDayConditions = weekDays.map(day => {
      if (differenceInDays >= 7) {
        return { [day]: true }
      } else {
        const startDateLuxon = luxon.DateTime.fromJSDate(data.startDate)
        const endDateLuxon = luxon.DateTime.fromJSDate(data.endDate)

        for (let dt = startDateLuxon; dt <= endDateLuxon; dt = dt.plus({ days: 1 })) {
          if (dt.weekday === weekDays.indexOf(day) + 1) {
            return { [day]: true }
          }
        }

        return { [day]: undefined }
      }
    })

    const blockedTimes = await prismaClient.blockedTime.findMany({
      where: {
        AND: [
          {
            isActive: true,
            professionalId: data.professionalId,
            OR: weekDayConditions
          },
          {
            OR: [
              {
                endDate: null,
                startDate: {
                  lte: data.endDate
                }
              },
              {
                startDate: {
                  lte: data.endDate
                },
                endDate: {
                  gte: data.startDate
                }
              }
            ]
          }
        ]
      },
      orderBy: {
        startDate: 'asc'
      }
    })

    return blockedTimes
  }

  public async delete (id: string) {
    await prismaClient.blockedTime.delete({
      where: { id }
    })
  }

  public async create (
    { extra: data, userId }: AuthContext<Prisma.BlockedTimeCreateInput>
  ) {
    const blockedTimeCreated = await prismaClient.blockedTime.create({
      data: {
        ...data,
        professional: {
          connect: {
            id: userId
          }
        }
      }
    })

    return blockedTimeCreated
  }

  public async update (
    id: string,
    data: Prisma.BlockedTimeUpdateInput
  ) {
    const updatedData = await prismaClient.blockedTime.update({
      where: {
        id
      },
      data
    })

    return updatedData
  }
}

export { PrismaBlockedTimeRepository }
