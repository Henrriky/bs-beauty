import { RatingsController } from "@/controllers/ratings.controller"
import { validateCreateRating } from "@/middlewares/data-validation/rating/create-rating.validation.middleware"
import { validateUpdateRating } from "@/middlewares/data-validation/rating/update-rating.validation.middleware"
import { routeAuthMiddleware } from "@/middlewares/route-auth.middleware"
import { Router } from "express"

const ratingRoutes = Router()

ratingRoutes.get('/', RatingsController.handleFindAll)
ratingRoutes.get('/:id', RatingsController.handleFindById)
ratingRoutes.post('/', routeAuthMiddleware(['PROFESSIONAL', 'MANAGER']), validateCreateRating, RatingsController.handleCreate)
ratingRoutes.put('/:id', validateUpdateRating, RatingsController.handleUpdate)
ratingRoutes.delete('/:id', routeAuthMiddleware(['MANAGER']), RatingsController.handleDelete)

export { ratingRoutes }