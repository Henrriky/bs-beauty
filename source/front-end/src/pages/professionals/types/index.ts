import { z } from 'zod'
import { ProfessionalSchemas } from '../../../utils/validation/zod-schemas/professional.zod-schemas.validation.utils'
import { PaginatedRequest, PaginatedResponse, Role } from '../../roles/types'
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

/* Update Commission */
export type UpdateCommissionRequest = {
  professionalId: string
  data: {
    commissionRate: number
  }
}

export type UpdateCommissionResponse = {
  message: string
}

/* ============== Professional Roles Management ============== */
export interface ProfessionalRole {
  id: string
  role: Role
}

export type GetProfessionalRolesRequest = {
  professionalId: string
}

export type GetProfessionalRolesResponse = {
  roles: ProfessionalRole[]
}

export type AddRoleToProfessionalRequest = {
  professionalId: string
  data: {
    roleId: string
  }
}

export type AddRoleToProfessionalResponse = {
  message: string
}

export type RemoveRoleFromProfessionalRequest = {
  professionalId: string
  data: {
    roleId: string
  }
}

export type RemoveRoleFromProfessionalResponse = {
  message: string
}
