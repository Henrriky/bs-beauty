import { makePaymentRecordUseCaseFactory } from '@/factory/make-payment-record-use-case.factory'
import { type CreatePaymentRecordInput, type UpdatePaymentRecordInput } from '@/repository/protocols/payment-record.repository'
import { paymentRecordQuerySchema } from '@/utils/validation/zod-schemas/pagination/payment-records/payment-records-query.schema'
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

      res.status(StatusCodes.OK).send(paymentRecords)
    } catch (error) {
      next(error)
    }
  }

  public static async handleFindByProfessionalIdPaginated (req: Request, res: Response, next: NextFunction) {
    try {
      const useCase = makePaymentRecordUseCaseFactory()
      const parsed = paymentRecordQuerySchema.parse(req.query)
      const { page, limit, ...filters } = parsed
      const professionalId = req.params.professionalId

      const result = await useCase.executefindByProfessionalIdPaginated(
        professionalId,
        {
          page,
          limit,
          filters
        }
      )
      res.send(result)
    } catch (error) {
      next(error)
    }
  }

  public static async handleCreate (req: Request, res: Response, next: NextFunction) {
    try {
      const useCase = makePaymentRecordUseCaseFactory()
      const data: CreatePaymentRecordInput = req.body
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
      const data: UpdatePaymentRecordInput = req.body
      const updatedPaymentRecord = await useCase.executeUpdate(paymentRecordId, data)

      res.status(StatusCodes.OK).send(updatedPaymentRecord)
    } catch (error) {
      next(error)
    }
  }

  public static async handleDelete (req: Request, res: Response, next: NextFunction) {
    try {
      const useCase = makePaymentRecordUseCaseFactory()
      const paymentRecordId = req.params.id
      const deletedPaymentRecord = await useCase.executeDelete(paymentRecordId)

      res.status(StatusCodes.OK).send(deletedPaymentRecord)
    } catch (error) {
      next(error)
    }
  }
}

export { PaymentRecordsController }
