import type { NextFunction, Request, Response } from 'express'
import { makeEmployeesUseCaseFactory } from '../factory/make-employees-use-case.factory'
import type { Prisma } from '@prisma/client'
import { StatusCodes } from 'http-status-codes'

class EmployeesController {
  public static async handleFindAll (req: Request, res: Response, next: NextFunction) {
    try {
      const useCase = makeEmployeesUseCaseFactory()
      const { employees } = await useCase.executeFindAll()

      res.status(StatusCodes.OK).send({ employees })
    } catch (error) {
      next(error)
    }
  }

  public static async handleFindById (req: Request, res: Response, next: NextFunction) {
    try {
      const employeeId = req.params.id
      const useCase = makeEmployeesUseCaseFactory()
      const employee = await useCase.executeFindById(employeeId)

      res.status(StatusCodes.OK).send(employee)
    } catch (error) {
      next(error)
    }
  }

  public static async handleCreate (req: Request, res: Response, next: NextFunction) {
    try {
      const newEmployee: Prisma.EmployeeCreateInput = req.body
      const useCase = makeEmployeesUseCaseFactory()
      const employee = await useCase.executeCreate(newEmployee)

      res.status(StatusCodes.CREATED).send(employee)
    } catch (error) {
      next(error)
    }
  }

  public static async handleUpdate (req: Request, res: Response, next: NextFunction) {
    try {
      const employeeToUpdate: Prisma.EmployeeUpdateInput = req.body
      const employeeId: string = req.params.id
      const useCase = makeEmployeesUseCaseFactory()
      const employeeUpdated = await useCase.executeUpdate(employeeId, employeeToUpdate)

      res.status(StatusCodes.OK).send(employeeUpdated)
    } catch (error) {
      next(error)
    }
  }

  public static async handleDelete (req: Request, res: Response, next: NextFunction) {
    try {
      const employeeId = req.params.id
      const useCase = makeEmployeesUseCaseFactory()
      const employeeDeleted = await useCase.executeDelete(employeeId)

      res.status(StatusCodes.OK).send(employeeDeleted)
    } catch (error) {
      next(error)
    }
  }
}

export { EmployeesController }
