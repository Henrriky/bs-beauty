import { type Prisma, type Offer } from '@prisma/client'
import { type OfferRepository } from '../repository/protocols/offer.repository'
import { RecordExistence } from '../utils/validation/record-existence.validation.util'

interface OfferOutput {
  offers: Offer[]
}

class OffersUseCase {
  constructor (private readonly offerRepository: OfferRepository) {}

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

  public async executeFindByServiceId (serviceId: string): Promise<OfferOutput> {
    const offers = await this.offerRepository.findByServiceId(serviceId)
    RecordExistence.validateManyRecordsExistence(offers, 'offers')

    return { offers }
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
}

export { OffersUseCase }
