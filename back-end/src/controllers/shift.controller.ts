import { type Prisma } from '@prisma/client'
import { type NextFunction, type Request, type Response } from 'express'
import { makeShiftUseCaseFactory } from '../factory/make-shift-use-case.factory'

class ShiftController {
  public static async handleFindAll (req: Request, res: Response, next: NextFunction) {
    try {
      const useCase = makeShiftUseCaseFactory()
      const { shifts } = await useCase.executeFindAll()

      res.send({ shifts })
    } catch (error) {
      next(error)
    }
  }

  public static async handleFindById (req: Request, res: Response, next: NextFunction) {
    try {
      const useCase = makeShiftUseCaseFactory()
      const shiftId = req.params.id
      const shift = await useCase.executeFindById(shiftId)

      res.send(shift)
    } catch (error) {
      next(error)
    }
  }

  public static async handleFindByEmployeeId (req: Request, res: Response, next: NextFunction) {
    try {

      const { userId } = req.user

      const useCase = makeShiftUseCaseFactory()
      const { shifts } = await useCase.executeFindByEmployeeId(userId)

      res.send({ shifts })
    } catch (error) {
      next(error)
    }
  }

  public static async handleCreate (req: Request, res: Response, next: NextFunction) {
    try {

      const { userId } = req.user

      const useCase = makeShiftUseCaseFactory()
      const shiftToCreate: Prisma.ShiftCreateInput = {
        ...req.body,
        employeeId: userId
      };      
      const newShift = await useCase.executeCreate(shiftToCreate)

      res.send(newShift)
    } catch (error) {
      next(error)
    }
  }

  public static async handleUpdateByIdAndEmployeeId(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId } = req.user
      const useCase = makeShiftUseCaseFactory()
      const shiftId = req.params.id
      const shiftToUpdate: Prisma.ShiftUpdateInput = {
        ...req.body,
        employeeId: userId
      }
      const updatedShift = await useCase.executeUpdate(shiftId, shiftToUpdate)

      res.send(updatedShift)
    } catch (error) {
      next(error)
    }
  }

  public static async handleDelete (req: Request, res: Response, next: NextFunction) {
    try {
      const useCase = makeShiftUseCaseFactory()
      const shiftId = req.params.id
      const deletedShift = await useCase.executeDelete(shiftId)

      res.send(deletedShift)
    } catch (error) {
      next(error)
    }
  }
}

export { ShiftController }
