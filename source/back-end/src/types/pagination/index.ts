export interface PaginatedRequest<T> {
  page: number
  limit: number
  filters: T
}

export interface PaginatedResult<T> {
  data: T[]
  total: number
  page: number
  totalPages: number
  limit: number
}
