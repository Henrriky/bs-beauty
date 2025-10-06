import { z } from 'zod'
import { PaymentRecordSchemas } from '../../../utils/validation/zod-schemas/payment-record.zod-schemas.validation.utils'

export const paymentLabels: Record<string, string> = {
  'credit-card': 'Cartão de Crédito',
  'debit-card': 'Cartão de Débito',
  pix: 'Pix',
  cash: 'Dinheiro',
  'bank-transfer': 'Transferência Bancária',
  'payment-link': 'Link de Pagamento',
}

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
