import { Router } from 'express'
import { OffersController } from '../../controllers/offers.controller'
import { validateCreateOffer } from '../../middlewares/data-validation/create/validate-create-offer.middleware'
import { validateUpdateOffer } from '../../middlewares/data-validation/update/validate-update-offer.middleware'
import { routeAuthMiddleware } from '../../middlewares/route-auth.middleware'
import { Role } from '@prisma/client'

const offerRoutes = Router()

offerRoutes.get('/', OffersController.handleFindAll)
offerRoutes.get('/service/:id', OffersController.handleFindByServiceId)
offerRoutes.get('/employee/:id', OffersController.handleFindByEmployeeId)
offerRoutes.get('/:id', OffersController.handleFindById)
offerRoutes.post('/', routeAuthMiddleware([Role.EMPLOYEE, Role.MANAGER]), validateCreateOffer, OffersController.handleCreate)
offerRoutes.put('/:id', routeAuthMiddleware([Role.EMPLOYEE, Role.MANAGER]), validateUpdateOffer, OffersController.handleUpdate)
offerRoutes.delete('/:id', routeAuthMiddleware([Role.EMPLOYEE, Role.MANAGER]), OffersController.handleDelete)

export { offerRoutes }
