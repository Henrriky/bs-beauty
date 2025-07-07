import { type Prisma, type Offer } from '@prisma/client'
import { type OfferRepository } from '../repository/protocols/offer.repository'
import { RecordExistence } from '../utils/validation/record-existence.validation.util'
import { CustomError } from '../utils/errors/custom.error.util'
import { type ShiftRepository } from '../repository/protocols/shift.repository'
import { DateFormatter } from '../utils/formatting/date.formatting.util'
import { type PaginatedRequest, type PaginatedResult } from '../types/pagination'
import { type OffersFilters } from '../types/offers/offers-filters'

interface OfferOutput {
  offers: Offer[]
}

interface AvailablesSchedulling {
  startTimestamp: number
  endTimestamp: number
  isBusy: boolean
}

class OffersUseCase {
  constructor (
    private readonly offerRepository: OfferRepository,
    private readonly shiftRepository: ShiftRepository
  ) { }

  public async executeFindAll (): Promise<OfferOutput> {
    const offers = await this.offerRepository.findAll()
    RecordExistence.validateManyRecordsExistence(offers, 'offers')

    return { offers }
  }

  public async executeFindById (offerId: string) {
    const offer = await this.offerRepository.findById(offerId)
    RecordExistence.validateRecordExistence(offer, 'Offer')

    return offer
  }

  public async executeFindByServiceId (serviceId: string) {
    const offer = await this.offerRepository.findByServiceId(serviceId)
    RecordExistence.validateRecordExistence(offer, 'Offer')

    return offer
  }

  public async executeFindByEmployeeId (employeeId: string): Promise<OfferOutput> {
    const offers = await this.offerRepository.findByEmployeeId(employeeId)
    RecordExistence.validateManyRecordsExistence(offers, 'offers')

    return { offers }
  }

  public async executeCreate (offerToCreate: Prisma.OfferCreateInput) {
    const offer = offerToCreate as unknown as Offer
    const serviceId = offer.serviceId
    const employeeId = offer.employeeId
    const offerFound = await this.offerRepository.findByEmployeeAndServiceId(serviceId, employeeId)
    RecordExistence.validateRecordNonExistence(offerFound, 'Offer')
    const newOffer = await this.offerRepository.create(offerToCreate)

    return newOffer
  }

  public async executeUpdate (offerId: string, offerToUpdate: Prisma.OfferUpdateInput) {
    await this.executeFindById(offerId)
    const updatedOffer = await this.offerRepository.update(offerId, offerToUpdate)

    return updatedOffer
  }

  public async executeDelete (offerId: string) {
    await this.executeFindById(offerId)
    const deletedOffer = await this.offerRepository.delete(offerId)

    return deletedOffer
  }

  public async executeFetchAvailableSchedulingToOfferByDay (serviceOfferingId: string, dayToFetchAvailableSchedulling: Date) {
    // Validate
    const serviceOffering = await this.offerRepository.findById(serviceOfferingId)
    const isValidServiceOffering = serviceOffering != null && serviceOffering?.isOffering

    if (!isValidServiceOffering) {
      throw new CustomError('Unable to fetch available scheduling because offer not exists or is not being offering', 400)
    }

    const employeeShiftByDay = await this.shiftRepository.findByEmployeeAndWeekDay(serviceOffering.employeeId, DateFormatter.formatDayOfDateToWeekDay(dayToFetchAvailableSchedulling))
    const isValidEmployeeShiftByDay = (employeeShiftByDay !== null) && !employeeShiftByDay.isBusy

    if (!isValidEmployeeShiftByDay) {
      throw new CustomError('Unable to fetch available scheduling because employee does not work on this day or not exists', 400, '')
    }

    const { shiftEnd, shiftStart } = employeeShiftByDay

    const currentDayShiftEndTimeAsDate = new Date(dayToFetchAvailableSchedulling)
    currentDayShiftEndTimeAsDate.setHours(employeeShiftByDay.shiftEnd.getHours(), shiftEnd.getMinutes(), shiftEnd.getSeconds(), shiftEnd.getMilliseconds())
    const currentDayShiftEndTime = currentDayShiftEndTimeAsDate.getTime()

    const currentStartTimeAsDate = new Date(dayToFetchAvailableSchedulling)
    currentStartTimeAsDate.setHours(shiftStart.getHours(), shiftStart.getMinutes(), shiftStart.getSeconds(), shiftStart.getMilliseconds())
    let currentStartTime = currentStartTimeAsDate.getTime()

    const estimatedTimeMs = serviceOffering.estimatedTime * 60_000

    const { validAppointmentsOnDay } = await this.offerRepository.fetchValidAppointmentsByProfessionalOnDay(
      serviceOffering.employeeId,
      dayToFetchAvailableSchedulling
    )

    const availableSchedulling: AvailablesSchedulling[] = []

    const hasAppointments = Array.isArray(validAppointmentsOnDay) && validAppointmentsOnDay.length > 0
    while ((currentStartTime + estimatedTimeMs) <= currentDayShiftEndTime) {
      const startTimestamp = currentStartTime
      const endTimestamp = startTimestamp + estimatedTimeMs

      let isBusy = false
      let skipAheadTime = estimatedTimeMs

      if (hasAppointments) {
        const overlappingAppointment = validAppointmentsOnDay.find(appointment => {
          const appointmentStart = appointment.appointmentDate.getTime()
          const appointmentDuration = appointment.estimatedTime * 60_000
          const appointmentEnd = appointmentStart + appointmentDuration

          const overlaps = startTimestamp < appointmentEnd && endTimestamp > appointmentStart

          return overlaps
        })

        if (overlappingAppointment) {
          isBusy = true
          skipAheadTime = overlappingAppointment.estimatedTime * 60_000
        }
      }

      availableSchedulling.push({
        startTimestamp,
        endTimestamp,
        isBusy
      })

      currentStartTime += skipAheadTime
    }

    return { availableSchedulling }
  }

  public async executeFindByEmployeeIdPaginated (
    employeeId: string,
    params: PaginatedRequest<OffersFilters>
  ): Promise<PaginatedResult<Offer>> {
    const result = await this.offerRepository.findByEmployeeIdPaginated(employeeId, params)

    return result
  }
}

export { OffersUseCase }
