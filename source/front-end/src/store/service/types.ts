import { PaginatedRequest, PaginatedResponse } from '../types'

export type Service = {
  id: string
  name: string
  description: string | null
  category: string
  createdAt: Date
  updatedAt: Date
}

export type ProfessionalsOfferingServiceOffer = {
  id: string
  estimatedTime?: number
  price?: string
  professional: {
    id: string
    name: string | null
    specialization: string | null
    profilePhotoUrl: string | null
    paymentMethods: { name: string }[] | undefined
  }
}

export type ProfessionalsOfferingService = {
  id: string
  offers: Array<ProfessionalsOfferingServiceOffer>
}

export type FindAllServicesParams = {
  name?: string | undefined
  category?: string | undefined
  q?: string | undefined
} & PaginatedRequest

export type FindAllServicesResponse = PaginatedResponse<Service>
