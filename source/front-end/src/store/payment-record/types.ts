type PaymentItem = {
  id: string
  quantity: number
  discount: number
  price: number
  paymentRecordId: string
  offerId: string
  createdAt: string
  updatedAt: string
}

export type PaymentRecord = {
  id: string
  totalValue: number
  paymentMethod: string
  customerId: string
  professionalId: string
  items: PaymentItem[]
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
