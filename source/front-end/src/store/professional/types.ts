import { Professional } from '../auth/types'

export interface PaginatedProfessionalsResponse {
  data: Professional[]
  total: number
  page: number
  totalPages: number
  limit: number
}

export type ServicesOfferedByProfessionalOffer = {
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

export type ServicesOfferedByProfessional = {
  id: string
  offers: ServicesOfferedByProfessionalOffer[]
}
