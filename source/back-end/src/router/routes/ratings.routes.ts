import { RatingsController } from "@/controllers/ratings.controller"
import { validateCreateRating } from "@/middlewares/data-validation/rating/create-rating.validation.middleware"
import { validateUpdateRating } from "@/middlewares/data-validation/rating/update-rating.validation.middleware"
import { routeAuthMiddleware } from "@/middlewares/route-auth.middleware"
import { Router } from "express"

const ratingRoutes = Router()

ratingRoutes.get('/', RatingsController.handleFindAll)
ratingRoutes.get('/:id', RatingsController.handleFindById)
ratingRoutes.post('/', routeAuthMiddleware(['CUSTOMER']), validateCreateRating, RatingsController.handleCreat)
ratingRoutes.put('/:id', routeAuthMiddleware(['CUSTOMER']), validateUpdateRating, RatingsController.handleUpdate)
ratingRoutes.delete('/:id', routeAuthMiddleware(['CUSTOMER']), RatingsController.handleDelete)

export { ratingRoutes }