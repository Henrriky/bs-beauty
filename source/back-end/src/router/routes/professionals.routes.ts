import { Router } from 'express'
import { ProfessionalsController } from '../../controllers/professionals.controller'
import { validateCreateProfessional } from '../../middlewares/data-validation/professional/create-professional.validation.middleware'
import { validateUpdateProfessional } from '../../middlewares/data-validation/professional/update-professional.validation.middleware'
import { routeAuthMiddleware } from '../../middlewares/route-auth.middleware'
import { validateQuery } from '../../middlewares/pagination/zod-request-validation.middleware'
import { professionalQuerySchema } from '../../utils/validation/zod-schemas/pagination/professionals/professionals-query.schema'

const professionalRoutes = Router()

professionalRoutes.get('/', routeAuthMiddleware(['MANAGER', 'CUSTOMER']), validateQuery(professionalQuerySchema), ProfessionalsController.handleFindAll)
professionalRoutes.get('/:id', routeAuthMiddleware(['MANAGER']), ProfessionalsController.handleFindById)
professionalRoutes.post('/', routeAuthMiddleware(['MANAGER']), validateCreateProfessional, ProfessionalsController.handleCreate)
professionalRoutes.put('/:id', routeAuthMiddleware(['MANAGER', 'PROFESSIONAL']), validateUpdateProfessional, ProfessionalsController.handleUpdate)
professionalRoutes.delete('/:id', routeAuthMiddleware(['MANAGER']), ProfessionalsController.handleDelete)
professionalRoutes.get('/:id/offers/service', ProfessionalsController.handleFetchServicesOfferedByProfessional)

export { professionalRoutes }
