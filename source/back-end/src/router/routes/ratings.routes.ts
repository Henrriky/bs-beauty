import { RatingsController } from '@/controllers/ratings.controller'
import { userTypeAuthMiddleware } from '@/middlewares/auth/user-type-auth.middleware'
import { validateCreateRating } from '@/middlewares/data-validation/rating/create-rating.validation.middleware'
import { validateUpdateRating } from '@/middlewares/data-validation/rating/update-rating.validation.middleware'
import { Router } from 'express'

const ratingRoutes = Router()

ratingRoutes.get('/', RatingsController.handleFindAll)
ratingRoutes.get('/:id', RatingsController.handleFindById)
ratingRoutes.post('/', userTypeAuthMiddleware(['PROFESSIONAL', 'MANAGER']), validateCreateRating, RatingsController.handleCreate)
ratingRoutes.put('/:id', validateUpdateRating, RatingsController.handleUpdate)
ratingRoutes.delete('/:id', userTypeAuthMiddleware(['MANAGER']), RatingsController.handleDelete)

export { ratingRoutes }
