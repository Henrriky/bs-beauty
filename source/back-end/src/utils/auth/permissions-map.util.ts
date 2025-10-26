import { type ValueOf } from '@/types/utils'

export const PERMISSIONS_MAP = {
  DASHBOARD: {
    TOTAL_EMPLOYEES: {
      permissionName: 'dashboard.total_employees',
      description: 'Permite visualizar o número total de funcionários cadastrados no sistema'
    }
  },
  PROFESSIONAL: {
    READ: {
      permissionName: 'professional.read',
      description: 'Permite visualizar a lista de profissionais e seus detalhes'
    },
    CREATE: {
      permissionName: 'professional.create',
      description: 'Permite criar um novo profissional'
    },
    DELETE: {
      permissionName: 'professional.delete',
      description: 'Permite remover um profissional existente'
    },
    EDIT: {
      permissionName: 'professional.edit',
      description: 'Permite editar os dados de um profissional existente'
    },
    MANAGE_ROLES: {
      permissionName: 'professional.manage_roles',
      description: 'Permite gerenciar as funções de um profissional'
    }
  },
  CUSTOMER: {
    READ: {
      permissionName: 'customer.read',
      description: 'Permite visualizar a lista de clientes e seus detalhes'
    },
    DELETE: {
      permissionName: 'customer.delete',
      description: 'Permite remover um cliente existente'
    }
  },
  SERVICE: {
    CREATE: {
      permissionName: 'service.create',
      description: 'Permite criar um novo serviço'
    },
    EDIT: {
      permissionName: 'service.edit',
      description: 'Permite editar um serviço existente'
    },
    APPROVE: {
      permissionName: 'service.approve',
      description: 'Permite aprovar um serviço existente'
    },
    DELETE: {
      permissionName: 'service.delete',
      description: 'Permite remover um serviço existente'
    }
  },
  ROLES: {
    READ: {
      permissionName: 'roles.read',
      description: 'Permite visualizar a lista de funções e seus detalhes'
    },
    CREATE: {
      permissionName: 'roles.create',
      description: 'Permite criar uma nova função'
    },
    EDIT: {
      permissionName: 'roles.edit',
      description: 'Permite editar uma função existente'
    },
    DELETE: {
      permissionName: 'roles.delete',
      description: 'Permite remover uma função existente'
    },
    CHANGE_PERMISSIONS: {
      permissionName: 'roles.change_permissions',
      description: 'Permite alterar as permissões de uma função existente'
    }
  },
  BLOCKED_TIME: {
    CREATE_OWN: {
      permissionName: 'blocked_time.create_own',
      description: 'Permite que o usuário crie um bloqueio de horário para si mesmo'
    },
    DELETE_OWN: {
      permissionName: 'blocked_time.delete_own',
      description: 'Permite que o usuário remova um bloqueio de horário do próprio usuário'
    },
    EDIT_OWN: {
      permissionName: 'blocked_time.edit_own',
      description: 'Permite que o usuário edite um bloqueio de horário do próprio usuário'
    },
    READ_OWN: {
      permissionName: 'blocked_time.read_own',
      description: 'Permite que o usuário visualize os próprios bloqueios de horário'
    },
    READ_ALL: {
      permissionName: 'blocked_time.read_all',
      description:
        'Permite visualizar os horários bloqueados de todos os usuários'
    },
    EDIT_ALL: {
      permissionName: 'blocked_time.edit_all',
      description: 'Permite editar os horários bloqueados de todos os usuários'
    },
    DELETE_ALL: {
      permissionName: 'blocked_time.delete_all',
      description: 'Permite remover os horários bloqueados de todos os usuários'
    }
  }
} as const

export type Permissions = ValueOf<typeof PERMISSIONS_MAP[keyof typeof PERMISSIONS_MAP]>['permissionName']
