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

export type ServicesOfferedByProfessionalParams = {
  professionalId: string
  category?: string | undefined
  q?: string | undefined
}

export type ServicesOfferedByProfessionalResponse = {
  id: string
  offers: ServicesOfferedByProfessionalOffer[]
}
