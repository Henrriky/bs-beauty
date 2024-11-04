import type { Request, Response } from 'express'
import { makeEmployeesUseCaseFactory } from '../factory/make-employees-use-case.factory'
import { type Prisma } from '@prisma/client'

class EmployeesController {
  public static useCase = makeEmployeesUseCaseFactory()

  public static async handleFindAll (req: Request, res: Response) {
    const useCase = makeEmployeesUseCaseFactory()
    const { employees } = await useCase.executeFindAll()

    res.send({ employees })
  }

  public static async handleFindById (req: Request, res: Response) {
    const employeeId = req.params.id
    const useCase = makeEmployeesUseCaseFactory()
    const employee = await useCase.executeFindById(employeeId)

    res.send(employee)
  }

  public static async handleCreate (req: Request, res: Response) {
    const newEmployee: Prisma.EmployeeCreateInput = req.body
    const useCase = makeEmployeesUseCaseFactory()
    const employee = await useCase.executeCreate(newEmployee)

    res.send(employee)
  }

  public static async handleUpdate (req: Request, res: Response) {
    const employeeToUpdate: Prisma.EmployeeUpdateInput = req.body
    const employeeId: string = req.params.id
    const useCase = makeEmployeesUseCaseFactory()
    const employeeUpdated = await useCase.executeUpdate(employeeId, employeeToUpdate)

    res.send(employeeUpdated)
  }

  public static async handleDelete (req: Request, res: Response) {
    const employeeId = req.params.id
    const useCase = makeEmployeesUseCaseFactory()
    const employeeDeleted = await useCase.executeDelete(employeeId)

    res.send(employeeDeleted)
  }
}

export { EmployeesController }
