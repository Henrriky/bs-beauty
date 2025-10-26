import { z } from 'zod'
import { BlockedTimeSchemas } from '../../../utils/validation/zod-schemas/blocked-times.zod-schemas.validation.utils'

/* Types */
export type BlockedTimeSelectPeriodPossibleValues =
  | 'undefined'
  | 'custom'
  | 'today'
  | '1week'
  | '1month'
  | '3months'
  | '6months'
  | '1year'

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
  startTime: string // ISO Format
  endTime: string // ISO Format
  startDate: string // ISO Format
  endDate: string // ISO Format
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
export type UpdateBlockedTimeFormData = CreateBlockedTimeFormData

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

/* Get By Professional ID And Period */
export type FindByProfessionalAndPeriodResponse = { data: BlockedTime[] }
export type FindByprofessionalAndPeriodRequest = {
  professionalId: string
  startDate: string // ISO Format
  endDate: string // ISO Format
}
