import { Router } from 'express'
import { ProfessionalsController } from '../../controllers/professionals.controller'
import { validateCreateProfessional } from '../../middlewares/data-validation/professional/create-professional.validation.middleware'
import { validateUpdateProfessional } from '../../middlewares/data-validation/professional/update-professional.validation.middleware'
import { validateQuery } from '../../middlewares/pagination/zod-request-validation.middleware'
import { professionalQuerySchema } from '../../utils/validation/zod-schemas/pagination/professionals/professionals-query.schema'
import { combinedAuthMiddleware } from '@/middlewares/auth/combined-auth.middleware'

const professionalRoutes = Router()

/* Public routes */
professionalRoutes.get(
  '/:id/offers/service',
  ProfessionalsController.handleFetchServicesOfferedByProfessional
)
professionalRoutes.get(
  '/',
  validateQuery(professionalQuerySchema),
  ProfessionalsController.handleFindAll
)

/* Protected routes */

professionalRoutes.get(
  '/:id',
  combinedAuthMiddleware(['MANAGER'], ['professional.read']),
  ProfessionalsController.handleFindById
)

professionalRoutes.post(
  '/',
  combinedAuthMiddleware(['MANAGER'], ['professional.create']),
  validateCreateProfessional,
  ProfessionalsController.handleCreate
)

professionalRoutes.put(
  '/:id',
  combinedAuthMiddleware(['MANAGER'], ['professional.edit']),
  validateUpdateProfessional, ProfessionalsController.handleUpdate
)

professionalRoutes.delete(
  '/:id',
  combinedAuthMiddleware(['MANAGER'], ['professional.delete']),
  ProfessionalsController.handleDelete
)

professionalRoutes.get(
  '/:id/roles',
  combinedAuthMiddleware(['MANAGER'], ['professional.manage_roles']),
  ProfessionalsController.handleGetRoles
)

professionalRoutes.post(
  '/:id/roles',
  combinedAuthMiddleware(['MANAGER'], ['professional.manage_roles']),
  ProfessionalsController.handleAddRole
)

professionalRoutes.delete(
  '/:id/roles',
  combinedAuthMiddleware(['MANAGER'], ['professional.manage_roles']),
  ProfessionalsController.handleRemoveRole
)

export { professionalRoutes }
