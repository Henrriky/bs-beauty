import { Router } from 'express'
import { RolesController } from '../../controllers/roles.controller'
import { validateCreateRole } from '../../middlewares/data-validation/role/create-role.validation.middleware'
import { validateUpdateRole } from '../../middlewares/data-validation/role/update-role.validation.middleware'
import { combinedAuthMiddleware } from '@/middlewares/auth/combined-auth.middleware'

const roleRoutes = Router()

roleRoutes.get('/', combinedAuthMiddleware(['MANAGER'], ['roles.read']), RolesController.handleFindAllPaginated)
roleRoutes.get('/:id', combinedAuthMiddleware(['MANAGER'], ['roles.read']), RolesController.handleFindById)
roleRoutes.post('/', combinedAuthMiddleware(['MANAGER'], ['roles.create']), validateCreateRole, RolesController.handleCreate)
roleRoutes.put('/:id', combinedAuthMiddleware(['MANAGER'], ['roles.edit']), validateUpdateRole, RolesController.handleUpdate)
roleRoutes.delete('/:id', combinedAuthMiddleware(['MANAGER'], ['roles.delete']), RolesController.handleDelete)

roleRoutes.get('/:id/associations', combinedAuthMiddleware(['MANAGER'], ['roles.read']), RolesController.handleFindRoleAssociations)

roleRoutes.post('/:id/permissions', combinedAuthMiddleware(['MANAGER'], ['roles.change_permissions']), RolesController.handleAddPermissionToRole)
roleRoutes.delete('/:id/permissions', combinedAuthMiddleware(['MANAGER'], ['roles.change_permissions']), RolesController.handleRemovePermissionFromRole)

export { roleRoutes }
