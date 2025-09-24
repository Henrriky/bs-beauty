import { makePaymentRecordUseCaseFactory } from '@/factory/make-payment-record-use-case.factory'
import { type Prisma } from '@prisma/client'
import { type NextFunction, type Request, type Response } from 'express'
import { StatusCodes } from 'http-status-codes'

class PaymentRecordsController {
  public static async handleFindById (req: Request, res: Response, next: NextFunction) {
    try {
      const useCase = makePaymentRecordUseCaseFactory()
      const paymentRecordId = req.params.id
      const paymentRecord = await useCase.executeFindById(paymentRecordId)

      res.status(StatusCodes.OK).send(paymentRecord)
    } catch (error) {
      next(error)
    }
  }

  public static async handleFindByProfessionalId (req: Request, res: Response, next: NextFunction) {
    try {
      const useCase = makePaymentRecordUseCaseFactory()
      const professionalId = req.params.professionalId
      const paymentRecords = await useCase.executeFindByProfessionalId(professionalId)

      res.status(StatusCodes.OK).send({ paymentRecords })
    } catch (error) {
      next(error)
    }
  }

  public static async handleCreate (req: Request, res: Response, next: NextFunction) {
    try {
      const useCase = makePaymentRecordUseCaseFactory()
      const data: Prisma.PaymentRecordCreateInput = req.body
      const newPaymentRecord = await useCase.executeCreate(data)

      res.status(StatusCodes.CREATED).send(newPaymentRecord)
    } catch (error) {
      next(error)
    }
  }

  public static async handleUpdate (req: Request, res: Response, next: NextFunction) {
    try {
      const useCase = makePaymentRecordUseCaseFactory()
      const paymentRecordId = req.params.id
      const data: Prisma.PaymentRecordUpdateInput = req.body
      const updatedPaymentRecord = await useCase.executeUpdate(paymentRecordId, data)

      res.status(StatusCodes.OK).send(updatedPaymentRecord)
    } catch (error) {
      next(error)
    }
  }
}

export { PaymentRecordsController }
