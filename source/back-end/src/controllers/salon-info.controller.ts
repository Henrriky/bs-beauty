import { makeSalonInfoUseCaseFactory } from '@/factory/make-salon-info-use-case.factory'
import { type Prisma } from '@prisma/client'
import { type NextFunction, type Request, type Response } from 'express'
import { StatusCodes } from 'http-status-codes'

class SalonInfoController {
  public static async handleFetchInfo (req: Request, res: Response, next: NextFunction) {
    try {
      const useCase = makeSalonInfoUseCaseFactory()
      const id = parseInt(req.params.id)
      const salonInfo = await useCase.executeFetchInfo(id)

      res.status(StatusCodes.OK).send(salonInfo)
    } catch (error) {
      next(error)
    }
  }

  public static async handleUpdateInfo (req: Request, res: Response, next: NextFunction) {
    try {
      const newSalonInfo: Prisma.SalonInfoUpdateInput = req.body
      const id = parseInt(req.params.id)
      const useCase = makeSalonInfoUseCaseFactory()
      const updatedSalonInfo = await useCase.executeUpdateInfo(id, newSalonInfo)

      res.status(StatusCodes.OK).send(updatedSalonInfo)
    } catch (error) {
      next(error)
    }
  }
}

export { SalonInfoController }
