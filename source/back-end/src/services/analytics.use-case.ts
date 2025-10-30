import { type AppointmentRepository } from '@/repository/protocols/appointment.repository'
import { type OfferRepository } from '@/repository/protocols/offer.repository'
import { type ProfessionalRepository } from '@/repository/protocols/professional.repository'
import { type RatingRepository } from '@/repository/protocols/rating.repository'
import { type ServiceRepository } from '@/repository/protocols/service.repository'
import { type PublicProfessionalInfo } from '@/types/analytics'
import { CustomError } from '@/utils/errors/custom.error.util'
import { Offer, Status } from '@prisma/client'
import { type GroupingPeriod } from '@/repository/protocols/appointment.repository'

class AnalyticsUseCase {
  constructor(
    private readonly ratingRepository: RatingRepository,
    private readonly serviceRepository: ServiceRepository,
    private readonly offerRepository: OfferRepository,
    private readonly appointmentRepository: AppointmentRepository,
    private readonly professionalRepository: ProfessionalRepository
  ) { }

  public async executeGetCustomerAmountPerRatingScore(
    requestingUser: { id: string, userType: 'CUSTOMER' | 'PROFESSIONAL' | 'MANAGER' },
    startDate?: Date,
    endDate?: Date,
    requestedProfessionalId?: string
  ) {
    const professionalIdToQuery = this.defineRequestedProfessionalIdByRequesterUserType(
      requestingUser.userType,
      requestedProfessionalId,
      requestingUser.id
    )

    const ratings = await this.ratingRepository.findAll()
    const customerCountPerRating: Record<number, number> = {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0
    }

    for (const rating of ratings) {
      if (typeof rating.appointmentId === 'string' && rating.appointmentId !== '' && rating.score !== null) {
        const appointment = await this.appointmentRepository.findById(rating.appointmentId)
        if (!appointment) continue

        if (professionalIdToQuery) {
          const offer = await this.offerRepository.findById(appointment.serviceOfferedId)
          if (!offer || offer.professionalId !== professionalIdToQuery) continue
        }

        if (startDate && endDate) {
          const appointmentDate = new Date(appointment.appointmentDate)
          if (appointmentDate < startDate || appointmentDate > endDate) continue
        }

        customerCountPerRating[rating.score] = (customerCountPerRating[rating.score] || 0) + 1
      }
    }

    return customerCountPerRating
  }

  public async executeGetMeanRatingByService(amount?: number) {
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

  public async executeGetMeanRatingOfProfessionals(amount?: number) {
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

  public async executeGetAppointmentNumberOnDateRangeByStatusProfessionalAndServices(
    requestingUser: { id: string, userType: 'CUSTOMER' | 'PROFESSIONAL' | 'MANAGER' },
    startDate: Date,
    endDate: Date,
    statusList?: string[],
    requestedProfessionalId?: string,
    serviceIds?: string[]
  ) {

    const professionalIdToQuery = await this.defineRequestedProfessionalIdByRequesterUserType(requestingUser.userType, requestedProfessionalId, requestingUser.id)
    const start = this.normalizeDateToStart(startDate)
    const end = this.normalizeDateToEnd(endDate)

    this.validateDateRange(start, end)

    const validStatuses = new Set(Object.values(Status))
    const filteredStatusList = statusList
      ?.map(s => String(s).toUpperCase())
      .filter(s => validStatuses.has(s as Status)) as Status[] | undefined

    const groupBy = this.determineGroupingPeriod(start, end)

    const groupedCounts = await this.appointmentRepository.countByDateRangeGrouped(
      start,
      end,
      groupBy,
      filteredStatusList,
      professionalIdToQuery,
      serviceIds
    )

    return {
      groupBy,
      data: groupedCounts
    }
  }

  public async executeGetEstimatedAppointmentTimeByProfessionalAndServices(
    requestingUser: { id: string, userType: 'CUSTOMER' | 'PROFESSIONAL' | 'MANAGER' },
    startDate: Date,
    endDate: Date,
    requestedProfessionalId?: string,
    serviceIds?: string[]
  ) {
    const professionalIdToQuery = this.defineRequestedProfessionalIdByRequesterUserType(requestingUser.userType, requestedProfessionalId, requestingUser.id)

    const start = this.normalizeDateToStart(startDate)
    const end = this.normalizeDateToEnd(endDate)

    this.validateDateRange(start, end)

    const groupBy = this.determineGroupingPeriod(start, end)

    const groupedEstimatedTime = await this.appointmentRepository.sumEstimatedTimeByDateRangeGrouped(
      start,
      end,
      groupBy,
      ["FINISHED"],
      professionalIdToQuery,
      serviceIds
    )

    return {
      groupBy,
      data: groupedEstimatedTime
    }
  }

  public async executeGetTopProfessionalsRatingsAnalytics(limit: number) {
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

  public async executeGetAppointmentCancelationRateByProfessional(
    requestingUser: { id: string, userType: 'CUSTOMER' | 'PROFESSIONAL' | 'MANAGER' },
    startDate: Date,
    endDate: Date,
    requestedProfessionalId?: string,
    serviceIds?: string[]
  ) {
    const professionalIdToQuery = this.defineRequestedProfessionalIdByRequesterUserType(requestingUser.userType, requestedProfessionalId, requestingUser.id)
    const start = this.normalizeDateToStart(startDate)
    const end = this.normalizeDateToEnd(endDate)

    this.validateDateRange(start, end)

    const allAppointments = await this.appointmentRepository.findByDateRangeStatusProfessionalAndServices(start, end, undefined, professionalIdToQuery, serviceIds)
    const canceledAppointments = allAppointments.filter(appointment => appointment.status === Status.CANCELLED)

    return {
      totalAppointments: allAppointments.length,
      canceledAppointments: canceledAppointments.length,
    }
  }

  // Helper methods

  private determineGroupingPeriod(startDate: Date, endDate: Date): GroupingPeriod {
    const diffInMs = endDate.getTime() - startDate.getTime()
    const diffInDays = diffInMs / (1000 * 60 * 60 * 24)

    if (diffInDays <= 14) {
      return 'day'
    }
    else if (diffInDays <= 60) {
      return 'week'
    }
    else {
      return 'month'
    }
  }

  private normalizeDateToStart(date: Date): Date {
    const start = new Date(date);
    start.setUTCHours(0, 0, 0, 0);
    return start;
  }

  private normalizeDateToEnd(date: Date): Date {
    const end = new Date(date);
    end.setUTCHours(23, 59, 59, 999);
    return end;
  }

  private validateDateRange(startDate: Date, endDate: Date): void {
    if (startDate.getTime() > endDate.getTime()) {
      throw new CustomError('startDate must be on or before endDate', 400, 'Please, provide a valid date range');
    }
  }

  private async getOfferIdsByServiceId(serviceId: string): Promise<string[]> {
    const offers = await this.offerRepository.findByServiceId(serviceId)
    return Array.isArray(offers) ? offers.map(o => o.id) : []
  }

  private async getOfferIdsByProfessionalId(professionalId: string): Promise<string[]> {
    const offers = await this.offerRepository.findByProfessionalId(professionalId)
    return Array.isArray(offers) ? offers.map(o => o.id) : []
  }

  private async getAppointmentIdsFromOfferIds(offerIds: string[]): Promise<string[]> {
    const appointmentIds: string[] = []
    for (const offerId of offerIds) {
      const appointments = await this.appointmentRepository.findByServiceOfferedId(offerId)
      if (Array.isArray(appointments)) appointmentIds.push(...appointments.map(a => a.id))
    }
    return appointmentIds
  }

  private async getRatingsStatsFromAppointmentIds(appointmentIds: string[], options?: { precision?: number }) {
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

  private defineRequestedProfessionalIdByRequesterUserType(userType: string, requestedProfessionalId?: string, requestingUserId?: string) {
    if (userType === 'MANAGER') {
      return requestedProfessionalId
    } else if (userType === 'PROFESSIONAL') {
      if (!requestedProfessionalId || requestedProfessionalId === requestingUserId) {
        return requestingUserId
      }
      throw new CustomError('Not authorized to perform this action.', 403, 'You do not have permission to access this data.')
    } else {
      return requestingUserId
    }
  }
}

export { AnalyticsUseCase }
