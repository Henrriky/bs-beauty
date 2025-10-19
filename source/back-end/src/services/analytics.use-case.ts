import { type AppointmentRepository } from '@/repository/protocols/appointment.repository'
import { type OfferRepository } from '@/repository/protocols/offer.repository'
import { type ProfessionalRepository } from '@/repository/protocols/professional.repository'
import { type RatingRepository } from '@/repository/protocols/rating.repository'
import { type ServiceRepository } from '@/repository/protocols/service.repository'
import { type PublicProfessionalInfo } from '@/types/analytics'
import { CustomError } from '@/utils/errors/custom.error.util'
import { Status } from '@prisma/client'

class AnalyticsUseCase {
  constructor (
    private readonly ratingRepository: RatingRepository,
    private readonly serviceRepository: ServiceRepository,
    private readonly offerRepository: OfferRepository,
    private readonly appointmentRepository: AppointmentRepository,
    private readonly professionalRepository: ProfessionalRepository
  ) { }

  public async executeGetCustomerAmountPerRatingScore () {
    const ratings = await this.ratingRepository.findAll()
    const customerCountPerRating: Record<number, number> = {}

    for (const rating of ratings) {
      if (typeof rating.appointmentId === 'string' && rating.appointmentId !== '' && rating.score !== null) {
        customerCountPerRating[rating.score] = (typeof customerCountPerRating[rating.score] === 'undefined' ? 0 : customerCountPerRating[rating.score]) + 1
      }
    }

    return customerCountPerRating
  }

  public async executeGetMeanRatingByService (amount?: number) {
    const services = await this.serviceRepository.findAll()

    const serviceRatings = await Promise.all(services.map(async (service) => {
      const offerIds = await this.getOfferIdsByServiceId(service.id)
      const appointmentIds = await this.getAppointmentIdsFromOfferIds(offerIds)
      const { meanRating } = await this.getRatingsStatsFromAppointmentIds(appointmentIds, { precision: 2 })

      return {
        service,
        meanRating
      }
    }))

    return await this.getBestRated(serviceRatings, amount)
  }

  public async executeGetMeanRatingOfProfessionals (amount?: number) {
    const professionals = await this.professionalRepository.findAll()
    const professionalRatings = await Promise.all(professionals.map(async (professional) => {
      const offerIds = await this.getOfferIdsByProfessionalId(professional.id)
      const appointmentIds = await this.getAppointmentIdsFromOfferIds(offerIds)
      const { meanRating } = await this.getRatingsStatsFromAppointmentIds(appointmentIds, { precision: 2 })

      return {
        professional,
        meanRating
      }
    }))

    return await this.getBestRated(professionalRatings, amount)
  }

  public async executeGetAppointmentNumberOnDateRangeByStatusAndProfessional (
    requestingUser: { id: string, userType: 'CUSTOMER' | 'PROFESSIONAL' |  'MANAGER' }, 
    startDate: Date, 
    endDate: Date, 
    statusList?: string[], 
    requestedProfessionalId?: string
  ) {

    let professionalIdToQuery: string | undefined

    if (requestingUser.userType === 'PROFESSIONAL') {
      professionalIdToQuery = requestingUser.id
    } else if (requestingUser.userType === 'MANAGER') {
      professionalIdToQuery = requestedProfessionalId
    } else {
      throw new Error('Not authorized to perform this action.') 
    }

    const start = new Date(startDate)
    start.setUTCHours(0, 0, 0, 0)

    const end = new Date(endDate)
    end.setUTCHours(23, 59, 59, 999)

    if (start.getTime() > end.getTime()) {
      throw new CustomError('startDate must be on or before endDate', 400, 'Please, provide a valid date range')
    }

    const validStatuses = new Set(Object.values(Status))
    const filteredStatusList = statusList
      ?.map(s => String(s).toUpperCase())
      .filter(s => validStatuses.has(s as Status)) as Status[] | undefined

    const appointments = await this.appointmentRepository.findByDateRangeStatusAndProfessional(start, end, filteredStatusList, professionalIdToQuery)
    return appointments.length
  }

  public async executeGetTopProfessionalsRatingsAnalytics (limit: number) {
    const professionals = await this.professionalRepository.findAll()
    const professionalRatings: PublicProfessionalInfo[] = await Promise.all(professionals.map(async (professional) => {
      const offerIds = await this.getOfferIdsByProfessionalId(professional.id)
      const appointmentIds = await this.getAppointmentIdsFromOfferIds(offerIds)
      const { meanRating, count } = await this.getRatingsStatsFromAppointmentIds(appointmentIds)
      return {
        ...professional,
        meanRating,
        ratingCount: count
      }
    }))
    return await this.getBestRated(professionalRatings, limit)
  }

  // Helper methods

  private async getOfferIdsByServiceId (serviceId: string): Promise<string[]> {
    const offers = await this.offerRepository.findByServiceId(serviceId)
    return Array.isArray(offers) ? offers.map(o => o.id) : []
  }

  private async getOfferIdsByProfessionalId (professionalId: string): Promise<string[]> {
    const offers = await this.offerRepository.findByProfessionalId(professionalId)
    return Array.isArray(offers) ? offers.map(o => o.id) : []
  }

  private async getAppointmentIdsFromOfferIds (offerIds: string[]): Promise<string[]> {
    const appointmentIds: string[] = []
    for (const offerId of offerIds) {
      const appointments = await this.appointmentRepository.findByServiceOfferedId(offerId)
      if (Array.isArray(appointments)) appointmentIds.push(...appointments.map(a => a.id))
    }
    return appointmentIds
  }

  private async getRatingsStatsFromAppointmentIds (appointmentIds: string[], options?: { precision?: number }) {
    const scores: number[] = []
    for (const appointmentId of appointmentIds) {
      const rating = await this.ratingRepository.findByAppointmentId(appointmentId)
      if ((rating != null) && typeof rating.score === 'number') scores.push(rating.score)
    }

    if (scores.length === 0) return { meanRating: null, count: 0 }

    const sum = scores.reduce((a, b) => a + b, 0)
    const rawMean = sum / scores.length
    const meanRating = (typeof options?.precision === 'number')
      ? Number.parseFloat(rawMean.toFixed(options.precision))
      : rawMean

    return { meanRating, count: scores.length }
  }

  private async getBestRated<T extends { meanRating?: number | null }>(
    object: T[],
    limit?: number
  ): Promise<T[]> {
    const bestRated = object
      .filter(o => o.meanRating !== null && typeof o.meanRating === 'number')
      .sort((a, b) => (b.meanRating ?? 0) - (a.meanRating ?? 0))

    const isLimited = typeof limit === 'number' && limit > 0

    return isLimited ? bestRated.slice(0, limit) : bestRated
  }
}

export { AnalyticsUseCase }
