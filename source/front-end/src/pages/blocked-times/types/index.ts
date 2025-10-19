import { z } from 'zod'
import { BlockedTimeSchemas } from '../../../utils/validation/zod-schemas/blocked-times.zod-schemas.validation.utils'

/* ============== Common Types ==============  */
export interface PaginatedRequest<T> {
  page?: number
  limit?: number
  filters?: T
}

export interface PaginatedResponse<T> {
  total: number
  page: number
  limit: number
  totalPages: number
  data: T[]
}

/* ============== Entities ==============  */
export interface BlockedTime {
  id: string
  reason: string
  isActive: boolean
  startTime: Date
  endTime: Date
  startDate: Date
  endDate: Date
  monday: boolean
  tuesday: boolean
  wednesday: boolean
  thursday: boolean
  friday: boolean
  saturday: boolean
  sunday: boolean
  createdAt: string
  updatedAt: string
}

/* ============== Forms ============== */
export type CreateBlockedTimeFormData = z.infer<
  typeof BlockedTimeSchemas.createSchema
>
export type UpdateBlockedTimeFormData = z.infer<
  typeof BlockedTimeSchemas.updateSchema
>

/* ============== API Requests ============== */

/* Create */
export type CreateBlockedTimeRequest = CreateBlockedTimeFormData
export type CreateBlockedTimeResponse = BlockedTime

/* Update */
export type UpdateBlockedTimeRequest = {
  id: string
  data: UpdateBlockedTimeFormData
}
export type UpdateBlockedTimeResponse = BlockedTime

/* Delete */
export type DeleteBlockedTimeRequest = string
export type DeleteBlockedTimeResponse = void

/* Get All */
export type GetBlockedTimesRequestFilters = {
  reason?: string
}
export type GetBlockedTimesRequest =
  PaginatedRequest<GetBlockedTimesRequestFilters>
export type GetBlockedTimesResponse = PaginatedResponse<BlockedTime>

/* Get By ID */
export type GetBlockedTimeByIdRequest = string
export type GetBlockedTimeByIdResponse = BlockedTime
