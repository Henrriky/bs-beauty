import { type Permissions } from './permissions-map.util'

export const PERMISSIONS_DATA: Record<string, Permissions[]> = {
  /* Professional */
  'GET /professionals': ['professional.read'],
  'GET /professionals/:id': ['professional.read'],
  'POST /professionals': ['professional.create'],
  'DELETE /professionals/:id': ['professional.delete'],
  'GET /professionals/:id/roles': ['professional.manage_roles'],
  'POST /professionals/:id/roles': ['professional.manage_roles'],
  'DELETE /professionals/:id/roles': ['professional.manage_roles'],

  /* Customer */
  'GET /customers': ['customer.read'],

  /* Service */
  'GET /services': ['service.read'],
  'POST /services': ['service.create'],
  'PUT /services/:id': ['service.edit'],
  'DELETE /services/:id': ['service.delete'],
  'POST /services/:id/approve': ['service.approve'],

  /* Roles */
  'GET /roles': ['roles.read'],
  'POST /roles': ['roles.create'],
  'PUT /roles/:id': ['roles.edit'],
  'DELETE /roles/:id': ['roles.delete'],
  'POST /roles/:id/permissions': ['roles.change_permissions'],
  'DELETE /roles/:id/permissions': ['roles.change_permissions']
}
