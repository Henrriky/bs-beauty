import { type Prisma, type Offer } from '@prisma/client'
import { type PaginatedRequest, type PaginatedResult } from '../../types/pagination'
import { type OffersFilters } from '../../types/offers/offers-filters'

interface OfferRepository {
  findAll: () => Promise<Offer[]>
  findById: (id: string) => Promise<Offer | null>
  findByServiceId: (serviceId: string) => Promise<Offer[] | null>
  findByProfessionalId: (professionalId: string) => Promise<Offer[]>
  findByProfessionalAndServiceId: (serviceId: string, professionalId: string) => Promise<Offer | null>
  create: (offerToCreate: Prisma.OfferCreateInput) => Promise<Offer>
  update: (id: string, offerToUpdate: Prisma.OfferUpdateInput) => Promise<Offer>
  delete: (id: string) => Promise<Offer>
  findByProfessionalIdPaginated: (professionalId: string, params: PaginatedRequest<OffersFilters>) => Promise<PaginatedResult<Offer>>
}

export { type OfferRepository }
