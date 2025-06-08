import { type Prisma, type Offer } from '@prisma/client'
import { type FetchAvailableSchedulingToOfferByDay } from '../types/offer-repository.types'
import { PaginatedRequest, PaginatedResult } from '../../types/pagination'
import { OffersFilters } from '../../types/offers/offers-filters'

interface OfferRepository {
  findAll: () => Promise<Offer[]>
  findById: (id: string) => Promise<Offer | null>
  findByServiceId: (serviceId: string) => Promise<Offer | null>
  findByEmployeeId: (employeeId: string) => Promise<Offer[]>
  findByEmployeeAndServiceId: (serviceId: string, employeeId: string) => Promise<Offer | null>
  create: (offerToCreate: Prisma.OfferCreateInput) => Promise<Offer>
  update: (id: string, offerToUpdate: Prisma.OfferUpdateInput) => Promise<Offer>
  delete: (id: string) => Promise<Offer>
  fetchValidAppointmentsByOfferAndDay: (serviceOfferingId: string, dayToFetchAvailableSchedulling: Date) => Promise<{ validAppointmentsToOfferOnDay: FetchAvailableSchedulingToOfferByDay | null } >
  findByEmployeeIdPaginated: (employeeId: string, params: PaginatedRequest<OffersFilters>) => Promise<PaginatedResult<Offer>>
  // fetchValidWorkingDaysByOfferAndMonth: (serviceOfferingId: string, monthToVerify: number) => Promise<>
}

export { type OfferRepository }
