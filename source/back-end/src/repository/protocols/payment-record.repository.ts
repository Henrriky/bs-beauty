import { type PaginatedRequest, type PaginatedResult } from '@/types/pagination'
import { type PartialPaymentRecordQuerySchema } from '@/utils/validation/zod-schemas/pagination/payment-records/payment-records-query.schema'
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
  totalValue: number
}

interface UpdatePaymentRecordInput {
  paymentMethod?: string
  customerId?: string
  items?: PaymentItemInput[]
  totalValue: number
}

interface PaymentRecordRepository {
  findById: (id: string) => Promise<PaymentRecord | null>
  findByProfessionalId: (professionalId: string) => Promise<PaymentRecord[]>
  findByProfessionalIdPaginated: (professionalId: string, params: PaginatedRequest<PartialPaymentRecordQuerySchema>) => Promise<PaginatedResult<PaymentRecord>>
  create: (data: CreatePaymentRecordInput) => Promise<PaymentRecord>
  update: (id: string, data: UpdatePaymentRecordInput) => Promise<PaymentRecord>
  delete: (id: string) => Promise<PaymentRecord>
}

export type { PaymentRecordRepository, CreatePaymentRecordInput, UpdatePaymentRecordInput }
