export const PERMISSIONS_MAP = {
  DASHBOARD: {
    TOTAL_EMPLOYEES: {
      permissionName: 'dashboard.total_employees',
    },
  },
  PROFESSIONAL: {
    READ: {
      permissionName: 'professional.read',
    },
    CREATE: {
      permissionName: 'professional.create',
    },
    DELETE: {
      permissionName: 'professional.delete',
    },
    EDIT: {
      permissionName: 'professional.edit',
    },
    MANAGE_ROLES: {
      permissionName: 'professional.manage_roles',
    },
  },
  CUSTOMER: {
    READ: {
      permissionName: 'customer.read',
    },
    DELETE: {
      permissionName: 'customer.delete',
    },
  },
  SERVICE: {
    CREATE: {
      permissionName: 'service.create',
    },
    EDIT: {
      permissionName: 'service.edit',
    },
    APPROVE: {
      permissionName: 'service.approve',
    },
    DELETE: {
      permissionName: 'service.delete',
    },
  },
  ROLES: {
    READ: {
      permissionName: 'roles.read',
    },
    CREATE: {
      permissionName: 'roles.create',
    },
    EDIT: {
      permissionName: 'roles.edit',
    },
    DELETE: {
      permissionName: 'roles.delete',
    },
    CHANGE_PERMISSIONS: {
      permissionName: 'roles.change_permissions',
    },
  },
} as const
