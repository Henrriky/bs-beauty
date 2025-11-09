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
  BLOCKED_TIME: {
    CREATE_OWN: {
      permissionName: 'blocked_time.create_own',
      resource: 'Bloqueio de Horário',
      action: 'Criar Próprio',
    },
    DELETE_OWN: {
      permissionName: 'blocked_time.delete_own',
      resource: 'Bloqueio de Horário',
      action: 'Deletar Próprio',
    },
    EDIT_OWN: {
      permissionName: 'blocked_time.edit_own',
      resource: 'Bloqueio de Horário',
      action: 'Editar Próprio',
    },
    READ_OWN: {
      permissionName: 'blocked_time.read_own',
      resource: 'Bloqueio de Horário',
      action: 'Ler Próprio',
    },
    READ_ALL: {
      permissionName: 'blocked_time.read_all',
      resource: 'Bloqueio de Horário',
      action: 'Ler Todos',
    },
    EDIT_ALL: {
      permissionName: 'blocked_time.edit_all',
      resource: 'Bloqueio de Horário',
      action: 'Editar Todos',
    },
    DELETE_ALL: {
      permissionName: 'blocked_time.delete_all',
      resource: 'Bloqueio de Horário',
      action: 'Deletar Todos',
    },
  },
  PAYMENT_RECORD: {
    READ: {
      permissionName: 'payment_record.read',
      resource: 'Registro de Pagamento',
      action: 'Ler',
    },
    CREATE: {
      permissionName: 'payment_record.create',
      resource: 'Registro de Pagamento',
      action: 'Criar',
    },
    EDIT: {
      permissionName: 'payment_record.edit',
      resource: 'Registro de Pagamento',
      action: 'Editar',
    },
    DELETE: {
      permissionName: 'payment_record.delete',
      resource: 'Registro de Pagamento',
      action: 'Deletar',
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
