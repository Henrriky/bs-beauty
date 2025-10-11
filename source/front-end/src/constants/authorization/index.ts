export const PERMISSIONS_MAP = {
  DASHBOARD: {
    TOTAL_EMPLOYEES: {
      permissionName: 'dashboard.total_employees',
      resource: 'Dashboard',
      action: 'Total Funcionários',
    },
  },
  PROFESSIONAL: {
    READ: {
      permissionName: 'professional.read',
      resource: 'Profissional',
      action: 'Ler',
    },
    CREATE: {
      permissionName: 'professional.create',
      resource: 'Profissional',
      action: 'Criar',
    },
    DELETE: {
      permissionName: 'professional.delete',
      resource: 'Profissional',
      action: 'Deletar',
    },
    EDIT: {
      permissionName: 'professional.edit',
      resource: 'Profissional',
      action: 'Editar',
    },
    MANAGE_ROLES: {
      permissionName: 'professional.manage_roles',
      resource: 'Profissional',
      action: 'Gerenciar Funções',
    },
  },
  CUSTOMER: {
    READ: {
      permissionName: 'customer.read',
      resource: 'Cliente',
      action: 'Ler',
    },
    DELETE: {
      permissionName: 'customer.delete',
      resource: 'Cliente',
      action: 'Deletar',
    },
  },
  SERVICE: {
    CREATE: {
      permissionName: 'service.create',
      resource: 'Serviço',
      action: 'Criar',
    },
    EDIT: {
      permissionName: 'service.edit',
      resource: 'Serviço',
      action: 'Editar',
    },
    APPROVE: {
      permissionName: 'service.approve',
      resource: 'Serviço',
      action: 'Aprovar',
    },
    DELETE: {
      permissionName: 'service.delete',
      resource: 'Serviço',
      action: 'Deletar',
    },
  },
  ROLES: {
    READ: {
      permissionName: 'roles.read',
      resource: 'Funções',
      action: 'Ler',
    },
    CREATE: {
      permissionName: 'roles.create',
      resource: 'Funções',
      action: 'Criar',
    },
    EDIT: {
      permissionName: 'roles.edit',
      resource: 'Funções',
      action: 'Editar',
    },
    DELETE: {
      permissionName: 'roles.delete',
      resource: 'Funções',
      action: 'Deletar',
    },
    CHANGE_PERMISSIONS: {
      permissionName: 'roles.change_permissions',
      resource: 'Funções',
      action: 'Alterar Permissões',
    },
  },
} as const

function createPermissionDisplayMap() {
  const displayMap: Record<string, { resource: string; action: string }> = {}

  Object.values(PERMISSIONS_MAP).forEach((resource) => {
    Object.values(resource).forEach((permission) => {
      displayMap[permission.permissionName] = {
        resource: permission.resource,
        action: permission.action,
      }
    })
  })

  return displayMap
}

export const permissionDisplayMap = createPermissionDisplayMap()
