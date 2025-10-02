import { z } from 'zod'
import { PaymentRecordSchemas } from '../../../utils/validation/zod-schemas/payment-record.zod-schemas.validation.utils'

type PaymentItem = z.infer<typeof PaymentRecordSchemas.paymentItemsSchema>

type CreatePaymentRecordFormData = z.infer<
  typeof PaymentRecordSchemas.createSchema
>

type OnSubmitCreatePaymentRecordForm = (
  data: CreatePaymentRecordFormData,
) => Promise<void>

export type {
  CreatePaymentRecordFormData,
  OnSubmitCreatePaymentRecordForm,
  PaymentItem,
}
