import { type AuthContext } from './../../types/shared/index'
import { type Prisma, type BlockedTime } from '@prisma/client'
import { type PaginatedRequest, type PaginatedResult } from '../../types/pagination'
import { type BlockedTimesRepositoryFilters } from '@/types/blocked-times/blocked-times'

export type FindAllPaginated = Prisma.BlockedTimeGetPayload<{
  include: {
    professional: {
      select: {
        name: true
      }
    }
  }
}>

interface BlockedTimeRepository {
  findAllPaginated: (data: AuthContext<PaginatedRequest<BlockedTimesRepositoryFilters>>) => Promise<PaginatedResult<FindAllPaginated>>
  findById: (id: string) => Promise<BlockedTime | null>
  findByProfessionalAndPeriod: (data: { professionalId: string, startDate: Date, endDate: Date }) => Promise<BlockedTime[]>
  update: (id: string, data: Prisma.BlockedTimeUpdateInput) => Promise<BlockedTime>
  create: (data: AuthContext<Prisma.BlockedTimeCreateInput>) => Promise<BlockedTime>
  delete: (id: string) => Promise<void>
}

export type { BlockedTimeRepository }
