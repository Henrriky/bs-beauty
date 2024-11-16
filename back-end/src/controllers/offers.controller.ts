import { type Request, type Response, type NextFunction } from 'express'
import { makeOffersUseCaseFactory } from '../factory/make-offers-use-case.factory'
import { type Prisma } from '@prisma/client'

class OffersController {
  public static async handleFindAll (req: Request, res: Response, next: NextFunction) {
    try {
      const useCase = makeOffersUseCaseFactory()
      const { offers } = await useCase.executeFindAll()

      res.send({ offers })
    } catch (error) {
      next(error)
    }
  }

  public static async handleFindById (req: Request, res: Response, next: NextFunction) {
    try {
      const useCase = makeOffersUseCaseFactory()
      const offerId = req.params.id
      const offer = await useCase.executeFindById(offerId)

      res.send(offer)
    } catch (error) {
      next(error)
    }
  }

  public static async handleFindByServiceId (req: Request, res: Response, next: NextFunction) {
    try {
      const useCase = makeOffersUseCaseFactory()
      const serviceId = req.params.serviceId
      const { offers } = await useCase.executeFindByServiceId(serviceId)

      res.send({ offers })
    } catch (error) {
      next(error)
    }
  }

  public static async handleFindByEmployeeId (req: Request, res: Response, next: NextFunction) {
    try {
      const useCase = makeOffersUseCaseFactory()
      const employeeId = req.params.employeeId
      const { offers } = await useCase.executeFindByEmployeeId(employeeId)

      res.send({ offers })
    } catch (error) {
      next(error)
    }
  }

  public static async handleCreate (req: Request, res: Response, next: NextFunction) {
    try {
      const useCase = makeOffersUseCaseFactory()
      const offerToCreate: Prisma.OfferCreateInput = req.body
      const newOffer = await useCase.executeCreate(offerToCreate)

      res.send(newOffer)
    } catch (error) {
      next(error)
    }
  }

  public static async handleUpdate (req: Request, res: Response, next: NextFunction) {
    try {
      const useCase = makeOffersUseCaseFactory()
      const offerId = req.params.id
      const offerToUpdate: Prisma.OfferUpdateInput = req.body
      const updatedOffer = await useCase.executeUpdate(offerId, offerToUpdate)

      res.send(updatedOffer)
    } catch (error) {
      next(error)
    }
  }

  public static async handleDelete (req: Request, res: Response, next: NextFunction) {
    try {
      const useCase = makeOffersUseCaseFactory()
      const offerId = req.params.id
      const deletedOffer = await useCase.executeDelete(offerId)

      res.send(deletedOffer)
    } catch (error) {
      next(error)
    }
  }
}

export { OffersController }
