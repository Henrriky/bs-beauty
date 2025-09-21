export interface PaginatedResponse<T> {
  total: number
  page: number
  limit: number
  totalPages: number
  data: T[]
}

export interface PaginatedRequest {
  page: number
  limit: number
}
