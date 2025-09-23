import { makeRatingsUseCaseFactory } from "@/factory/make-ratings-use-case.factory"
import { NextFunction, Request, Response } from "express"
import { StatusCodes } from "http-status-codes"

class RatingsController {
    public static async handleFindAll(req: Request, res: Response, next: NextFunction) {
        try {
            const useCase = makeRatingsUseCaseFactory()
            const { ratings } = await useCase.executeFindAll()

            res.send({ ratings })
        } catch (error) {
            next(error)
        }
    }

    public static async handleFindById(req: Request, res: Response, next: NextFunction) {
        try {
            const ratingId = req.params.id
            const useCase = makeRatingsUseCaseFactory()
            const rating = await useCase.executeFindById(ratingId)

            res.status(StatusCodes.OK).send(rating)
        } catch (error) {
            next(error)
        }
    }
}

export { RatingsController }