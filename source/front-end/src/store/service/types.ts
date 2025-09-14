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

export interface PaginatedServicesResponse {
  data: Service[]
  total: number
  page: number
  totalPages: number
  limit: number
}
