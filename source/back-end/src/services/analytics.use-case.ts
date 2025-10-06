import { AppointmentRepository } from "@/repository/protocols/appointment.repository"
import { OfferRepository } from "@/repository/protocols/offer.repository"
import { ProfessionalRepository } from "@/repository/protocols/professional.repository"
import { RatingRepository } from "@/repository/protocols/rating.repository"
import { ServiceRepository } from "@/repository/protocols/service.repository"

class AnalyticsUseCase {
  constructor (
    private readonly ratingRepository: RatingRepository, 
    private readonly serviceRepository: ServiceRepository, 
    private readonly offerRepository: OfferRepository, 
    private readonly appointmentRepository: AppointmentRepository,
    private readonly professionalRepository: ProfessionalRepository
  ) { }

  public async executeGetCustomerAmountPerRatingScore() {
    const ratings = await this.ratingRepository.findAll()
    const customerCountPerRating: Record<number, number> = {}

    for (const rating of ratings) {
      if (rating.appointmentId && rating.score !== null) {
        customerCountPerRating[rating.score] = (customerCountPerRating[rating.score] || 0) + 1
      }
    }

    return customerCountPerRating
  }

  public async executeGetMeanRatingByService(amount: number) {
    const services = await this.serviceRepository.findAll()

    const serviceRatings = await Promise.all(services.map(async (service) => {
      const offers = await this.offerRepository.findByServiceId(service.id)
      console.log('offers:', offers, 'isArray:', Array.isArray(offers))
      const offerIds = Array.isArray(offers) ? offers.map(o => o.id) : []
      
      let appointmentIds: string[] = []
      for (const offerId of offerIds) {
        const appointments = await this.appointmentRepository.findByServiceOfferedId(offerId)
        appointmentIds.push(...appointments.map(a => a.id))
      }

      let scores: number[] = []
      for (const appointmentId of appointmentIds) {
        const rating = await this.ratingRepository.findByAppointmentId(appointmentId)
        if (rating && typeof rating.score === 'number') {
          scores.push(rating.score)
        }
      }

      const meanRating = scores.length 
        ? parseFloat((scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(2)) 
        : null
      return {
        service,
        meanRating
      }
    }))

    const bestRated = serviceRatings
      .filter(sr => sr.meanRating !== null)
      .sort((a, b) => (b.meanRating! - a.meanRating!))
      .slice(0, amount)

    return bestRated
  }

  public async executeGetMeanRatingOfProfessionals(amount: number) {
    const professionals = await this.professionalRepository.findAll()
    const professionalRatings = await Promise.all(professionals.map(async (professional) => {
      const offers = await this.offerRepository.findByProfessionalId(professional.id)
      const offerIds = offers.map(o => o.id)

      let appointmentIds: string[] = []
      for (const offerId of offerIds) {
        const appointments = await this.appointmentRepository.findByServiceOfferedId(offerId)
        appointmentIds.push(...appointments.map(a => a.id))
      }

      let scores: number[] = []
      for (const appointmentId of appointmentIds) {
        const rating = await this.ratingRepository.findByAppointmentId(appointmentId)
        if (rating && typeof rating.score === 'number') {
          scores.push(rating.score)
        }
      }

      const meanRating = scores.length
        ? parseFloat((scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(2))
        : null
      return {
        professional,
        meanRating
      }
    }))

    const bestRated = professionalRatings
      .filter(pr => pr.meanRating !== null)
      .sort((a, b) => (b.meanRating! - a.meanRating!))
      .slice(0, amount)

    return bestRated
  }

}

export { AnalyticsUseCase }