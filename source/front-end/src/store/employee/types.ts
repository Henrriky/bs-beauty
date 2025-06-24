import { Employee } from '../auth/types'

export interface PaginatedEmployeesResponse {
  data: Employee[]
  total: number
  page: number
  totalPages: number
  limit: number
}

export type ServicesOfferedByEmployeeOffer = {
  id: string
  estimatedTime?: number
  price?: string
  service: {
    id: string
    name: string
    description: string | null
    category: string
  }
}

export type ServicesOfferedByEmployee = {
  id: string
  offers: ServicesOfferedByEmployeeOffer[]
}
