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
  }
} as const

export type Permissions = ValueOf<typeof PERMISSIONS_MAP[keyof typeof PERMISSIONS_MAP]>['permissionName']
