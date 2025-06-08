import { Employee } from "../auth/types"

export interface PaginatedEmployeesResponse {
  data: Employee[]
  total: number
  page: number
  totalPages: number
  limit: number
}
