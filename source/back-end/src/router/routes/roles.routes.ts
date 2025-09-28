import { Router } from 'express'
import { RolesController } from '../../controllers/roles.controller'
import { routeAuthMiddleware } from '../../middlewares/route-auth.middleware'
import { validateCreateRole } from '../../middlewares/data-validation/role/create-role.validation.middleware'
import { validateUpdateRole } from '../../middlewares/data-validation/role/update-role.validation.middleware'

const roleRoutes = Router()

roleRoutes.get('/', routeAuthMiddleware(['MANAGER']), RolesController.handleFindAllPaginated)
roleRoutes.get('/:id', routeAuthMiddleware(['MANAGER']), RolesController.handleFindById)
roleRoutes.get('/:id/associations', routeAuthMiddleware(['MANAGER']), RolesController.handleFindRoleAssociations)
roleRoutes.post('/', routeAuthMiddleware(['MANAGER']), validateCreateRole, RolesController.handleCreate)
roleRoutes.post('/:id/permissions', routeAuthMiddleware(['MANAGER']), RolesController.handleAddPermissionToRole)
roleRoutes.delete('/:id/permissions', routeAuthMiddleware(['MANAGER']), RolesController.handleRemovePermissionFromRole)
roleRoutes.put('/:id', routeAuthMiddleware(['MANAGER']), validateUpdateRole, RolesController.handleUpdate)
roleRoutes.delete('/:id', routeAuthMiddleware(['MANAGER']), RolesController.handleDelete)

export { roleRoutes }
