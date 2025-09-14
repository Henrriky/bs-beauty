import { makeSalonSettingsUseCaseFactory } from '@/factory/make-salon-settings-use-case.factory';
import { Prisma } from '@prisma/client';
import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

class SalonSettingsController {
  public static async handleFetchInfo(req: Request, res: Response, next: NextFunction) {
    try {
      const useCase = makeSalonSettingsUseCaseFactory()
      const id = parseInt(req.params.id)
      const salonInfo = await useCase.executeFetchInfo(id)

      res.status(StatusCodes.OK).send(salonInfo)
    } catch (error) {
      next(error)
    }
  }

  public static async handleUpdateInfo(req: Request, res: Response, next: NextFunction) {
    try {
      const newSalonInfo: Prisma.SalonSettingsUpdateInput = req.body
      const id = parseInt(req.params.id)
      const useCase = makeSalonSettingsUseCaseFactory()
      const updatedSalonInfo = await useCase.executeUpdateInfo(id, newSalonInfo)

      res.status(StatusCodes.OK).send(updatedSalonInfo)
    } catch (error) {
      next(error)
    }
  }
}

export { SalonSettingsController }
