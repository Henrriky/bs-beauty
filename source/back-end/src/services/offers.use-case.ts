import { type Prisma, type Offer } from '@prisma/client'
import { type OfferRepository } from '../repository/protocols/offer.repository'
import { RecordExistence } from '../utils/validation/record-existence.validation.util'
import { CustomError } from '../utils/errors/custom.error.util'
import { type ShiftRepository } from '../repository/protocols/shift.repository'
import { DateFormatter } from '../utils/formatting/date.formatting.util'
import { type PaginatedRequest, type PaginatedResult } from '../types/pagination'
import { type OffersFilters } from '../types/offers/offers-filters'
import { type AppointmentRepository } from '../repository/protocols/appointment.repository'

interface OfferOutput {
  offers: Offer[]
}

interface AvailablesSchedulling {
  startTimestamp: number
  endTimestamp: number
  isBusy: boolean
}

class OffersUseCase {
  constructor(
    private readonly offerRepository: OfferRepository,
    private readonly shiftRepository: ShiftRepository,
    private readonly appointmentRepository: AppointmentRepository
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
    const offer = await this.offerRepository.findByServiceId(serviceId)
    RecordExistence.validateRecordExistence(offer, 'Offer')

    return offer
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

  public async executeFetchAvailableSchedulingToOfferByDay (
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

    const currentDayShiftEndTimeAsDate = new Date(dayToFetchAvailableSchedulling)
    currentDayShiftEndTimeAsDate.setHours(professionalShiftByDay.shiftEnd.getHours(), shiftEnd.getMinutes(), shiftEnd.getSeconds(), shiftEnd.getMilliseconds())
    const currentDayShiftEndTime = currentDayShiftEndTimeAsDate.getTime()

    const currentStartTimeAsDate = new Date(dayToFetchAvailableSchedulling)
    currentStartTimeAsDate.setHours(shiftStart.getHours(), shiftStart.getMinutes(), shiftStart.getSeconds(), shiftStart.getMilliseconds())
    let currentStartTime = currentStartTimeAsDate.getTime()

    const estimatedTimeMs = serviceOffering.estimatedTime * 60_000

    const [
      { validAppointmentsOnDay: nonFinishedAppointmentsByEmployeeOnDay },
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

    const nonFinishedAppointmentsByCustomerAndEmployeeOnDay = [
      ...nonFinishedAppointmentsByCustomerOnDay,
      ...nonFinishedAppointmentsByEmployeeOnDay
    ]

    const availableSchedulling: AvailablesSchedulling[] = []

    const hasAppointments = Array.isArray(nonFinishedAppointmentsByCustomerAndEmployeeOnDay) && nonFinishedAppointmentsByCustomerAndEmployeeOnDay.length > 0
    while ((currentStartTime + estimatedTimeMs) <= currentDayShiftEndTime) {
      const startTimestamp = currentStartTime
      const endTimestamp = startTimestamp + estimatedTimeMs

      let isBusy = false
      let skipAheadTime = estimatedTimeMs

      if (hasAppointments) {
        const overlappingAppointment = nonFinishedAppointmentsByCustomerAndEmployeeOnDay.find(appointment => {
          const appointmentStart = appointment.appointmentDate.getTime()
          const appointmentDuration = appointment.estimatedTime * 60_000
          const appointmentEnd = appointmentStart + appointmentDuration

          const overlaps = startTimestamp < appointmentEnd && endTimestamp > appointmentStart

          return overlaps
        })

        if (overlappingAppointment != null) {
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

  public async executeFindByProfessionalIdPaginated(
    professionalId: string,
    params: PaginatedRequest<OffersFilters>
  ): Promise<PaginatedResult<Offer>> {
    const result = await this.offerRepository.findByProfessionalIdPaginated(professionalId, params)

    return result
  }
}

export { OffersUseCase }
