import { type AuthContext } from './../../types/shared/index'
import { type Prisma } from '@prisma/client'
import { prismaClient } from '../../lib/prisma'
import { type PaginatedRequest } from '../../types/pagination'
import { type BlockedTimesRepositoryFilters } from '@/types/blocked-times/blocked-times'
import { type BlockedTimeRepository } from '../protocols/blocked-times.repository'

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
        orderBy: { createdAt: 'desc' }
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
