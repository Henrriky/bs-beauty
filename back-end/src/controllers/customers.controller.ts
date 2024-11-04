import type { Request, Response } from 'express'
import { makeCustomersUseCaseFactory } from '../factory/make-customers-use-case.factory'
import { type Prisma } from '@prisma/client'

class CustomersController {
  public static useCase = makeCustomersUseCaseFactory()

  public static async handleFindAll (req: Request, res: Response) {
    const useCase = makeCustomersUseCaseFactory()
    const { customers } = await useCase.executeFindAll()

    res.send({ customers })
  }

  public static async handleFindById (req: Request, res: Response) {
    const customerId = req.params.id
    const useCase = makeCustomersUseCaseFactory()
    const customer = await useCase.executeFindById(customerId)

    res.send(customer)
  }

  public static async handleCreate (req: Request, res: Response) {
    const newCustomer: Prisma.CustomerCreateInput = req.body
    const useCase = makeCustomersUseCaseFactory()
    const customer = await useCase.executeCreate(newCustomer)

    res.send(customer)
  }

  public static async handleUpdate (req: Request, res: Response) {
    const customerToUpdate: Prisma.CustomerUpdateInput = req.body
    const customerId: string = req.params.id
    const useCase = makeCustomersUseCaseFactory()
    const customerUpdated = await useCase.executeUpdate(customerId, customerToUpdate)

    res.send(customerUpdated)
  }

  public static async handleDelete (req: Request, res: Response) {
    const customerId = req.params.id
    const useCase = makeCustomersUseCaseFactory()
    const customerDeleted = await useCase.executeDelete(customerId)

    res.send(customerDeleted)
  }
}

export { CustomersController }
