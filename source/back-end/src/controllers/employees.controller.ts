import type { NextFunction, Request, Response } from 'express'
import { makeEmployeesUseCaseFactory } from '../factory/make-employees-use-case.factory'
import type { Prisma } from '@prisma/client'
import { StatusCodes } from 'http-status-codes'
import { employeeQuerySchema } from '../utils/validation/zod-schemas/pagination/employees/employees-query.schema'
import bcrypt from 'bcrypt'

class EmployeesController {
  public static async handleFindAll (req: Request, res: Response, next: NextFunction) {
    try {
      const useCase = makeEmployeesUseCaseFactory()
      const parsed = employeeQuerySchema.parse(req.query)
      const { page, limit, ...filters } = parsed

      const result = await useCase.executeFindAllPaginated({
        page,
        limit,
        filters
      })

      res.status(StatusCodes.OK).send(result)
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
      const { password, confirmPassword, ...employeeData } = req.body

      if (password) {
        const passwordHash = await bcrypt.hash(password, 10)
        employeeData.passwordHash = passwordHash
      }

      const useCase = makeEmployeesUseCaseFactory()
      const employee = await useCase.executeCreate(employeeData)

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

  public static async handleFetchServicesOfferedByEmployee (req: Request, res: Response, next: NextFunction) {
    try {
      const useCase = makeEmployeesUseCaseFactory()
      const { employee } = await useCase.fetchServicesOfferedByEmployee(req.params.id)

      res.send({ employee })
    } catch (error) {
      next(error)
    }
  }
}

export { EmployeesController }
