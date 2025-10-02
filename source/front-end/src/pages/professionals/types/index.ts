import { z } from 'zod'
import { ProfessionalSchemas } from '../../../utils/validation/zod-schemas/professional.zod-schemas.validation.utils'
import { PaginatedRequest, PaginatedResponse } from '../../roles/types'
import { Professional } from '../../../store/auth/types'

/* ============== Forms ============== */
export type CreateProfessionalFormData = z.infer<
  typeof ProfessionalSchemas.createSchema
>

/* ============== API Requests ============== */

/* Get All */
export type GetProfessionalsFiters = {
  email?: string
}
export type GetProfessionalsRequest = PaginatedRequest<GetProfessionalsFiters>
export type GetProfessionalsResponse = PaginatedResponse<Professional>

/* Create */
export type CreateProfessionalRequest = CreateProfessionalFormData
export type CreateProfessionalResponse = Professional
