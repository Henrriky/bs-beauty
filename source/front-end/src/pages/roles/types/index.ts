import { z } from 'zod'
import { RoleSchemas } from '../../../utils/validation/zod-schemas/role.zod-schemas.validation.utils'

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
export interface Permission {
  id: string
  name: string
  resource: string
  action: string
  description: string
  createdAt: string
  updatedAt: string
}

export interface Professional {
  id: string
  name: string
  email: string
  specialization: string
  profilePhotoUrl?: string
  contact: string
  paymentMethods: string[]
  isActive: boolean
  registerCompleted: boolean
  googleId?: string
  createdAt: string
  updatedAt: string
}

export interface Role {
  id: string
  name: string
  description: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

/* ============== Forms ============== */
export type CreateRoleFormData = z.infer<typeof RoleSchemas.createSchema>

/* ============== API Requests ============== */

/* Create */
export type CreateRoleRequest = CreateRoleFormData
export type CreateRoleResponse = Role

/* Update */
export type UpdateRoleRequest = { id: string; data: CreateRoleFormData }
export type UpdateRoleResponse = Role

/* Delete */
export type DeleteRoleRequest = string
export type DeleteRoleResponse = Role

/* Get All */
export type GetRolesRequestFilters = {
  name?: string
}
export type GetRolesRequest = PaginatedRequest<GetRolesRequestFilters>
export type GetRolesResponse = PaginatedResponse<Role>

/* Get By ID */
export type GetRoleByIdRequest = string
export type GetRoleByIdResponse = Role

/* Get Role Associations */
export type GetRoleAssociationsFilters = {
  type?: 'permission' | 'professional' | 'all'
}
export type GetRoleAssociationsRequest = {
  id: string
} & PaginatedRequest<GetRoleAssociationsFilters>

export type GetRoleAssociationsResponse = PaginatedResponse<{
  permissions: Permission[]
  professionals: Professional[]
  totalPermissions: number
  totalProfessionals: number
}>

/* Manage Role Permissions */
export type AddPermissionToRoleRequest = {
  roleId: string
  data: { permissionId: string }
}
export type AddPermissionToRoleResponse = { message: string }

export type RemovePermissionFromRoleRequest = {
  roleId: string
  data: { permissionId: string }
}
export type RemovePermissionFromRoleResponse = { message: string }
