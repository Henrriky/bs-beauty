import { Customer } from "../auth/types"

export interface PaginatedCustomersResponse {
  data: Customer[]
  total: number
  page: number
  totalPages: number
  limit: number
}
