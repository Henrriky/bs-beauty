import { Router } from 'express'
import { PermissionsController } from '../../controllers/permissions.controller'
import { userTypeAuthMiddleware } from '../../middlewares/auth/user-type-auth.middleware'
import { validateQuery } from '../../middlewares/pagination/zod-request-validation.middleware'
import { permissionQuerySchema } from '../../utils/validation/zod-schemas/pagination/permissions/permissions-query.schema'
import { UserType } from '@prisma/client'

const permissionRoutes = Router()

permissionRoutes.get('/', userTypeAuthMiddleware([UserType.MANAGER, UserType.PROFESSIONAL]), validateQuery(permissionQuerySchema), PermissionsController.handleFindAllPaginated)

export { permissionRoutes }
