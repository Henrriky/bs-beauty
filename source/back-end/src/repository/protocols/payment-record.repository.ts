import { type PaymentRecord } from '@prisma/client'

interface PaymentItemInput {
  id?: string
  quantity: number
  discount: number
  price: number
  offerId: string
}

interface CreatePaymentRecordInput {
  paymentMethod: string
  customerId: string
  professionalId: string
  items: PaymentItemInput[]
}

interface UpdatePaymentRecordInput {
  paymentMethod?: string
  customerId?: string
  items?: PaymentItemInput[]
}

interface PaymentRecordRepository {
  findById: (id: string) => Promise<PaymentRecord | null>
  findByProfessionalId: (professionalId: string) => Promise<PaymentRecord[]>
  create: (data: CreatePaymentRecordInput) => Promise<PaymentRecord>
  update: (id: string, data: UpdatePaymentRecordInput) => Promise<PaymentRecord>
  delete: (id: string) => Promise<PaymentRecord>
}

export type { PaymentRecordRepository, CreatePaymentRecordInput, UpdatePaymentRecordInput }
