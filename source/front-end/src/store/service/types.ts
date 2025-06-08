export type Service = {
  id: string
  name: string
  description: string | null
  category: string
  createdAt: Date
  updatedAt: Date
}

export type EmployeesOfferingServiceOffer = {
  id: string
  estimatedTime: number
  price: string
  employee: {
    id: string
    name: string | null
    specialization: string | null
    profilePhotoUrl: string | null
  }
}

export type EmployeesOfferingService = {
  id: string
  offers: Array<EmployeesOfferingServiceOffer>
}

export interface PaginatedServicesResponse {
  data: Service[]
  total: number
  page: number
  totalPages: number
  limit: number
}
