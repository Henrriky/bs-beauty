import { Router } from 'express'
import { OffersController } from '../../controllers/offers.controller'
import { validateCreateOffer } from '../../middlewares/data-validation/offer/create-offer.validation.middleware'
import { validateUpdateOffer } from '../../middlewares/data-validation/offer/update-offer.validation.middleware'
import { userTypeAuthMiddleware } from '../../middlewares/auth/user-type-auth.middleware'
import { UserType } from '@prisma/client'
import { validateFetchAvailableSchedulling } from '../../middlewares/data-validation/offer/fetch-available-schedulling.validation.middleware'
import { offerQuerySchema } from '../../utils/validation/zod-schemas/pagination/offers/offers-query.schema'
import { validateQuery } from '../../middlewares/pagination/zod-request-validation.middleware'

const offerRoutes = Router()

offerRoutes.get('/', OffersController.handleFindAll)
offerRoutes.get('/:id/schedulling', validateFetchAvailableSchedulling, OffersController.handleFetchAvailableSchedulingToOfferByDay)
offerRoutes.get('/service/:id', OffersController.handleFindByServiceId)
offerRoutes.get('/professional/:professionalId', validateQuery(offerQuerySchema), OffersController.handleFindByProfessionalIdPaginated)
offerRoutes.get('/:id', OffersController.handleFindById)
offerRoutes.post('/', userTypeAuthMiddleware([UserType.PROFESSIONAL, UserType.MANAGER]), validateCreateOffer, OffersController.handleCreate)
offerRoutes.put('/:id', userTypeAuthMiddleware([UserType.PROFESSIONAL, UserType.MANAGER]), validateUpdateOffer, OffersController.handleUpdate)
offerRoutes.delete('/:id', userTypeAuthMiddleware([UserType.PROFESSIONAL, UserType.MANAGER]), OffersController.handleDelete)

export { offerRoutes }
