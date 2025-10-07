export type PaymentRecord = {
  id: string
  totalValue: number
  paymentMethod: string
  customerId: string
  professionalId: string
  createdAt: string
  updatedAt: string
}

export interface PaginatedPaymentRecordResponse {
  data: PaymentRecord[]
  total: number
  page: number
  totalPages: number
  limit: number
}
