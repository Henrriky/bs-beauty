import { makeRatingsUseCaseFactory } from "@/factory/make-ratings-use-case.factory"
import { Prisma } from "@prisma/client"
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

  public static async handleFindByAppointmentId(req: Request, res: Response, next: NextFunction) {
    try {
      const appointmentId = req.params.appointmentId
      const useCase = makeRatingsUseCaseFactory()
      const rating = await useCase.executeFindByAppointmentId(appointmentId)

      res.status(StatusCodes.OK).send(rating)
    } catch (error) {
      next(error)
    }
  }

  public static async handleCreate (req: Request, res: Response, next: NextFunction) {
    try {
      const useCase = makeRatingsUseCaseFactory()
      const ratingToCreate: Prisma.RatingCreateInput = req.body
      const newRating = await useCase.executeCreate(ratingToCreate)

      res.send(newRating)
    } catch (error) {
      next(error)
    }
  }

  public static async handleUpdate (req: Request, res: Response, next: NextFunction) {
    try {
      const useCase = makeRatingsUseCaseFactory()
      const ratingId = req.params.id
      const ratingToUpdate: Prisma.RatingUpdateInput = req.body
      const updatedRating = await useCase.executeUpdate(ratingId, ratingToUpdate)

      res.send(updatedRating)
    } catch (error) {
      next(error)
    }
  }

  public static async handleDelete (req: Request, res: Response, next: NextFunction) {
    try {
      const useCase = makeRatingsUseCaseFactory()
      const ratingId = req.params.id
      const deletedRating = await useCase.executeDelete(ratingId)

      res.send(deletedRating)
    } catch (error) {
      next(error)
    }
  }

  
}

export { RatingsController }