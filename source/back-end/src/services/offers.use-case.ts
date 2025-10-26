import { type Prisma, type Offer, ServiceStatus } from '@prisma/client'
import { type OfferRepository } from '../repository/protocols/offer.repository'
import { RecordExistence } from '../utils/validation/record-existence.validation.util'
import { CustomError } from '../utils/errors/custom.error.util'
import { type ShiftRepository } from '../repository/protocols/shift.repository'
import { DateFormatter } from '../utils/formatting/date.formatting.util'
import { type PaginatedRequest, type PaginatedResult } from '../types/pagination'
import { type OffersFilters } from '../types/offers/offers-filters'
import { type AppointmentRepository } from '../repository/protocols/appointment.repository'
import { type ServiceRepository } from '@/repository/protocols/service.repository'
import { BlockedTimesUseCase } from './blocked-times.use-case'

interface OfferOutput {
  offers: Offer[]
}

interface AvailablesSchedulling {
  startTimestamp: number
  endTimestamp: number
  isBusy: boolean
}

const VALID_STATUS_OF_SERVICE_TO_OFFER = ServiceStatus.APPROVED

class OffersUseCase {
  constructor(
    private readonly offerRepository: OfferRepository,
    private readonly shiftRepository: ShiftRepository,
    private readonly appointmentRepository: AppointmentRepository,
    private readonly serviceRepository: ServiceRepository,
    private readonly blockedTimesUseCase: BlockedTimesUseCase
  ) { }

  public async executeFindAll(): Promise<OfferOutput> {
    const offers = await this.offerRepository.findAll()
    RecordExistence.validateManyRecordsExistence(offers, 'offers')

    return { offers }
  }

  public async executeFindById(offerId: string) {
    const offer = await this.offerRepository.findById(offerId)
    RecordExistence.validateRecordExistence(offer, 'Offer')

    return offer
  }

  public async executeFindByServiceId(serviceId: string) {
    const offers = await this.offerRepository.findByServiceId(serviceId)
    RecordExistence.validateManyRecordsExistence(offers ?? [], 'offers')

    return offers
  }

  public async executeFindByProfessionalId(professionalId: string): Promise<OfferOutput> {
    const offers = await this.offerRepository.findByProfessionalId(professionalId)
    RecordExistence.validateManyRecordsExistence(offers, 'offers')

    return { offers }
  }

  public async executeCreate(offerToCreate: Prisma.OfferCreateInput) {
    const offer = offerToCreate as unknown as Offer
    const serviceId = offer.serviceId
    const professionalId = offer.professionalId
    const offerFound = await this.offerRepository.findByProfessionalAndServiceId(serviceId, professionalId)
    RecordExistence.validateRecordNonExistence(offerFound, 'Offer')

    const service = await this.serviceRepository.findById(serviceId)
    RecordExistence.validateRecordExistence(service, 'Service')
    const serviceHasValidStatus = service?.status === VALID_STATUS_OF_SERVICE_TO_OFFER
    if (!serviceHasValidStatus) {
      throw new CustomError('Bad Request', 400, `Service must be ${VALID_STATUS_OF_SERVICE_TO_OFFER.toString()} to create an offer.`)
    }

    const newOffer = await this.offerRepository.create(offerToCreate)

    return newOffer
  }

  public async executeUpdate(offerId: string, offerToUpdate: Prisma.OfferUpdateInput) {
    await this.executeFindById(offerId)
    const updatedOffer = await this.offerRepository.update(offerId, offerToUpdate)

    return updatedOffer
  }

  public async executeDelete(offerId: string) {
    await this.executeFindById(offerId)
    const deletedOffer = await this.offerRepository.delete(offerId)

    return deletedOffer
  }

  public async executeFetchAvailableSchedulingToOfferByDay(
    {
      customerId,
      serviceOfferingId,
      dayToFetchAvailableSchedulling
    }: {
      customerId: string
      serviceOfferingId: string
      dayToFetchAvailableSchedulling: Date
    }) {
    // Validate
    const serviceOffering = await this.offerRepository.findById(serviceOfferingId)
    const isValidServiceOffering = serviceOffering != null && serviceOffering?.isOffering

    if (!isValidServiceOffering) {
      throw new CustomError('Unable to fetch available scheduling because offer not exists or is not being offering', 400)
    }

    const professionalShiftByDay = await this.shiftRepository.findByProfessionalAndWeekDay(serviceOffering.professionalId, DateFormatter.formatDayOfDateToWeekDay(dayToFetchAvailableSchedulling))
    const isValidProfessionalShiftByDay = (professionalShiftByDay !== null) && !professionalShiftByDay.isBusy

    if (!isValidProfessionalShiftByDay) {
      throw new CustomError('Unable to fetch available scheduling because professional does not work on this day or not exists', 400, '')
    }


    const { shiftEnd, shiftStart } = professionalShiftByDay

    // Determine start and end cut-off date based on the professional shift
    const { timestamp: currentDayShiftEndTime, date: currentDayShiftEndTimeAsDate } = this.getDateForCombinedDays({
      dayToExtractDate: dayToFetchAvailableSchedulling,
      dayToExtractTime: shiftEnd
    })

    let { timestamp: currentDayStartTime, date: currentDayShiftStartTimeAsDate } = this.getDateForCombinedDays({
      dayToExtractDate: dayToFetchAvailableSchedulling,
      dayToExtractTime: shiftStart
    })
    // Determine estimated time in seconds
    const estimatedTimeMs = serviceOffering.estimatedTime * 60_000


    // Search non finished appointments by professional and customer on day
    const [
      { validAppointmentsOnDay: nonFinishedAppointmentsByProfessionalOnDay },
      { validAppointmentsOnDay: nonFinishedAppointmentsByCustomerOnDay }
    ] =
      await Promise.all([
        this.appointmentRepository.findNonFinishedByUserAndDay(
          serviceOffering.professionalId,
          dayToFetchAvailableSchedulling
        ),
        this.appointmentRepository.findNonFinishedByUserAndDay(
          customerId,
          dayToFetchAvailableSchedulling
        )
      ])

    const nonFinishedAppointmentsByCustomerAndProfessionalOnDay = [
      ...nonFinishedAppointmentsByCustomerOnDay,
      ...nonFinishedAppointmentsByProfessionalOnDay
    ]

    const blockedTimesValidForDay = await this.blockedTimesUseCase.executeFindByProfessionalAndPeriod({
      professionalId: serviceOffering.professionalId,
      startDate: currentDayShiftStartTimeAsDate.toISOString(),
      endDate: currentDayShiftEndTimeAsDate.toISOString()
    })

    // Variable that should be returned.
    const availableSchedulling: AvailablesSchedulling[] = []

    const hasAppointments = nonFinishedAppointmentsByCustomerAndProfessionalOnDay.length > 0
    const hasBlockedTimes = blockedTimesValidForDay.length > 0
    while ((currentDayStartTime + estimatedTimeMs) <= currentDayShiftEndTime) {
      const startTimestamp = currentDayStartTime
      const endTimestamp = startTimestamp + estimatedTimeMs

      let isBusy = false
      let nextCurrentDayStartTime = currentDayStartTime + estimatedTimeMs

      if (hasAppointments) {
        const overlappingAppointment = nonFinishedAppointmentsByCustomerAndProfessionalOnDay.find(appointment => {
          const appointmentStart = appointment.appointmentDate.getTime()
          const appointmentDuration = appointment.estimatedTime * 60_000
          const appointmentEnd = appointmentStart + appointmentDuration

          const overlaps = startTimestamp < appointmentEnd && endTimestamp > appointmentStart

          return overlaps
        })

        if (overlappingAppointment != null) {
          isBusy = true
          // const ONE_MINUTE_IN_MS = 1000 * 60
          // const appointmentStart = overlappingAppointment.appointmentDate.getTime()
          // const appointmentDuration = overlappingAppointment.estimatedTime * 60_000
          // const overlappingAppointmentEndTime = appointmentStart + appointmentDuration + ONE_MINUTE_IN_MS
          // nextCurrentDayStartTime = overlappingAppointmentEndTime
        }
      }

      if (hasBlockedTimes) {

        const overlappingBlockedTime = blockedTimesValidForDay.find(blockedTime => {
          const blockedTimeStartHourAsDate = new Date(dayToFetchAvailableSchedulling)
          blockedTimeStartHourAsDate.setHours(
            blockedTime.startTime.getHours(),
            blockedTime.startTime.getMinutes(),
            blockedTime.startTime.getSeconds(),
            blockedTime.startTime.getMilliseconds()
          )
          const { timestamp: blockedTimeStartHourTimestamp } = this.getDateForCombinedDays({
            dayToExtractDate: dayToFetchAvailableSchedulling,
            dayToExtractTime: blockedTime.startTime
          })
          const { timestamp: blockedTimeEndHourTimestamp } = this.getDateForCombinedDays({
            dayToExtractDate: dayToFetchAvailableSchedulling,
            dayToExtractTime: blockedTime.endTime
          })

          const overlaps = startTimestamp < blockedTimeEndHourTimestamp && endTimestamp > blockedTimeStartHourTimestamp

          return overlaps
        })

        if (overlappingBlockedTime != null) {
          isBusy = true
          const { timestamp: blockedTimeEndHourTimestamp } = this.getDateForCombinedDays({
            dayToExtractDate: dayToFetchAvailableSchedulling,
            dayToExtractTime: overlappingBlockedTime.endTime
          })
          nextCurrentDayStartTime = blockedTimeEndHourTimestamp
        }
      }


      availableSchedulling.push({
        startTimestamp,
        endTimestamp,
        isBusy
      })

      currentDayStartTime = nextCurrentDayStartTime
    }

    return { availableSchedulling }
  }

  public async executeFindByProfessionalIdPaginated(
    professionalId: string,
    params: PaginatedRequest<OffersFilters>
  ): Promise<PaginatedResult<Offer>> {
    const result = await this.offerRepository.findByProfessionalIdPaginated(professionalId, params)

    return result
  }


  private getDateForCombinedDays(
    {
      dayToExtractTime,
      dayToExtractDate
    }: {
      dayToExtractTime: Date
      dayToExtractDate: Date
    }
  ) {
    const mainDay = new Date(dayToExtractDate)
    mainDay.setHours(dayToExtractTime.getHours(), dayToExtractTime.getMinutes(), dayToExtractTime.getSeconds(), dayToExtractTime.getMilliseconds())
    return { timestamp: mainDay.getTime(), date: mainDay }
  }
}

export { OffersUseCase }
