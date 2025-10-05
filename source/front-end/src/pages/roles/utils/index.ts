type PermissionKey =
  | 'dashboard.total_employees'
  | 'professional.read'
  | 'professional.create'
  | 'professional.delete'
  | 'professional.edit'
  | 'professional.manage_roles'
  | 'customer.read'
  | 'customer.delete'
  | 'service.create'
  | 'service.edit'
  | 'service.approve'
  | 'service.delete'
  | 'roles.read'
  | 'roles.create'
  | 'roles.edit'
  | 'roles.delete'
  | 'roles.change_permissions'

type PermissionTranslation = {
  resource: string
  action: string
}

const permissionTranslationByKey: Record<PermissionKey, PermissionTranslation> =
  {
    'dashboard.total_employees': {
      resource: 'Dashboard',
      action: 'Total Funcionários',
    },
    'professional.read': {
      resource: 'Profissional',
      action: 'Ler',
    },
    'professional.create': {
      resource: 'Profissional',
      action: 'Criar',
    },
    'professional.delete': {
      resource: 'Profissional',
      action: 'Deletar',
    },
    'professional.edit': {
      resource: 'Profissional',
      action: 'Editar',
    },
    'professional.manage_roles': {
      resource: 'Profissional',
      action: 'Gerenciar Funções',
    },
    'customer.read': {
      resource: 'Cliente',
      action: 'Ler',
    },
    'customer.delete': {
      resource: 'Cliente',
      action: 'Deletar',
    },
    'service.create': {
      resource: 'Serviço',
      action: 'Criar',
    },
    'service.edit': {
      resource: 'Serviço',
      action: 'Editar',
    },
    'service.approve': {
      resource: 'Serviço',
      action: 'Aprovar',
    },
    'service.delete': {
      resource: 'Serviço',
      action: 'Deletar',
    },
    'roles.read': {
      resource: 'Funções',
      action: 'Ler',
    },
    'roles.create': {
      resource: 'Funções',
      action: 'Criar',
    },
    'roles.edit': {
      resource: 'Funções',
      action: 'Editar',
    },
    'roles.delete': {
      resource: 'Funções',
      action: 'Deletar',
    },
    'roles.change_permissions': {
      resource: 'Funções',
      action: 'Alterar Permissões',
    },
  }

export const getPermissionTranslationByCompositeKey = (
  compositeKey: string,
) => {
  return (
    permissionTranslationByKey[compositeKey as PermissionKey] || {
      resource: compositeKey,
      action: '',
    }
  )
}
