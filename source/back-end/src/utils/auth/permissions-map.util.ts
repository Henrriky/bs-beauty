import { type ValueOf } from '@/types/utils'

export const PERMISSIONS_MAP = {
  DASHBOARD: {
    TOTAL_EMPLOYEES: 'dashboard.total_employees'
  },
  PROFESSIONAL: {
    READ: 'professional.read',
    CREATE: 'professional.create',
    DELETE: 'professional.delete',
    EDIT: 'professional.edit',
    MANAGE_ROLES: 'professional.manage_roles'
  },
  CUSTOMER: {
    READ: 'customer.read',
    DELETE: 'customer.delete'
  },
  SERVICE: {
    CREATE: 'service.create',
    EDIT: 'service.edit',
    APPROVE: 'service.approve',
    DELETE: 'service.delete'
  },
  ROLES: {
    READ: 'roles.read',
    CREATE: 'roles.create',
    EDIT: 'roles.edit',
    DELETE: 'roles.delete',
    CHANGE_PERMISSIONS: 'roles.change_permissions'
  }
} as const

export type Permissions = ValueOf<typeof PERMISSIONS_MAP[keyof typeof PERMISSIONS_MAP]>
