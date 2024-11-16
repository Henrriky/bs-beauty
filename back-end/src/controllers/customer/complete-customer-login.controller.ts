import { type Response, type Request, type NextFunction } from 'express'
import { type Prisma } from '@prisma/client'
import { makeCustomersUseCaseFactory } from '../../factory/make-customers-use-case.factory'

class CompleteCustomerLoginController {
  public static async handle (req: Request, res: Response, next: NextFunction) {
    try {
      const customerToCreate: Prisma.CustomerCreateInput = req.body
      const useCase = makeCustomersUseCaseFactory()
      const customer = await useCase.executeCreate(customerToCreate)

      res.send(customer)
    } catch (error) {
      next(error)
    }
  }
}

export { CompleteCustomerLoginController }
