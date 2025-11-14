import { type Permission, type Professional } from '@prisma/client'

interface RoleAssociation {
  permissions: Permission[]
  professionals: Professional[]
  totalPermissions: number
  totalProfessionals: number
}

interface RoleAssociationFilters {
  type?: 'permission' | 'professional' | 'all'
}

export type { RoleAssociation, RoleAssociationFilters }
