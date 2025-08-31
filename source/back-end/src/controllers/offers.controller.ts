import { type Request, type Response, type NextFunction } from 'express'
import { makeOffersUseCaseFactory } from '../factory/make-offers-use-case.factory'
import { type Prisma } from '@prisma/client'
import { offerQuerySchema } from '../utils/validation/zod-schemas/pagination/offers/offers-query.schema'

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
      const offer = await useCase.executeFindByServiceId(serviceId)

      res.send(offer)
    } catch (error) {
      next(error)
    }
  }

  public static async handleFindByProfessionalId (req: Request, res: Response, next: NextFunction) {
    try {
      const useCase = makeOffersUseCaseFactory()
      const professionalId = req.params.professionalId
      const { offers } = await useCase.executeFindByProfessionalId(professionalId)

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

  public static async handleFetchAvailableSchedulingToOfferByDay (req: Request, res: Response, next: NextFunction) {
    try {
      const useCase = makeOffersUseCaseFactory()
      const serviceOfferingId = req.params.id
      const dayToFetchAvailableSchedulling: Date = new Date((req.query.dayToFetchAvailableSchedulling as string))

      const { availableSchedulling } = await useCase.executeFetchAvailableSchedulingToOfferByDay(
        serviceOfferingId,
        dayToFetchAvailableSchedulling
      )

      res.send({ availableSchedulling })
    } catch (error) {
      next(error)
    }
  }

  public static async handleFindByProfessionalIdPaginated (req: Request, res: Response, next: NextFunction) {
    try {
      const useCase = makeOffersUseCaseFactory()
      const parsed = offerQuerySchema.parse(req.query)
      const { page, limit, ...filters } = parsed
      const professionalId = req.params.professionalId
      const result = await useCase.executeFindByProfessionalIdPaginated(
        professionalId,
        {
          page,
          limit,
          filters
        }
      )

      res.send(result)
    } catch (error) {
      next(error)
    }
  }
}

export { OffersController }
