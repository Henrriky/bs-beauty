import { type Prisma } from '@prisma/client'
import { type NextFunction, type Request, type Response } from 'express'
import { makeCustomersUseCaseFactory } from '../factory/make-customers-use-case.factory'
import { customerQuerySchema } from '../utils/validation/zod-schemas/pagination/customers/customers-query.schema'

class CustomersController {
  public static async handleFindAll (req: Request, res: Response, next: NextFunction) {
    try {
      const useCase = makeCustomersUseCaseFactory()
      const { customers } = await useCase.executeFindAll()

      res.send({ customers })
    } catch (error) {
      next(error)
    }
  }

  public static async handleFindById (req: Request, res: Response, next: NextFunction) {
    try {
      const customerId = req.params.id
      const useCase = makeCustomersUseCaseFactory()
      const customer = await useCase.executeFindById(customerId)

      res.send(customer)
    } catch (error) {
      next(error)
    }
  }

  public static async handleCreate (req: Request, res: Response, next: NextFunction) {
    try {
      const customerToCreate: Prisma.CustomerCreateInput = req.body
      const useCase = makeCustomersUseCaseFactory()
      const customer = await useCase.executeCreate(customerToCreate)

      res.send(customer)
    } catch (error) {
      next(error)
    }
  }

  public static async handleUpdate (req: Request, res: Response, next: NextFunction) {
    try {
      const customerToUpdate: Prisma.CustomerUpdateInput = req.body
      const customerId: string = req.params.id
      const useCase = makeCustomersUseCaseFactory()
      const customerUpdated = await useCase.executeUpdate(customerId, customerToUpdate)

      res.send(customerUpdated)
    } catch (error) {
      next(error)
    }
  }

  public static async handleDelete (req: Request, res: Response, next: NextFunction) {
    try {
      const customerId = req.params.id
      const useCase = makeCustomersUseCaseFactory()
      const customerDeleted = await useCase.executeDelete(customerId)

      res.send(customerDeleted)
    } catch (error) {
      next(error)
    }
  }

  public static async handleFindAllPaginated (req: Request, res: Response, next: NextFunction) {
    try {
      const useCase = makeCustomersUseCaseFactory()
      const parsed = customerQuerySchema.parse(req.query)
      const { page, limit, ...filters } = parsed

      const result = await useCase.executeFindAllPaginated({
        page,
        limit,
        filters
      })
      res.send(result)
    } catch (error) {
      next(error)
    }
  }
}

export { CustomersController }
