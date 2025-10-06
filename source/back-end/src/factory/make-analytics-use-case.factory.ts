import { PrismaAppointmentRepository } from "@/repository/prisma/prisma-appointment.repository"
import { PrismaOfferRepository } from "@/repository/prisma/prisma-offer.repository"
import { PrismaProfessionalRepository } from "@/repository/prisma/prisma-professional.repository"
import { PrismaRatingRepository } from "@/repository/prisma/prisma-rating.repository"
import { PrismaServiceRepository } from "@/repository/prisma/prisma-service.repository"
import { AnalyticsUseCase } from "@/services/analytics.use-case"

function makeAnalyticsUseCaseFactory() {
  const ratingsRepository = new PrismaRatingRepository()
  const serviceRepository = new PrismaServiceRepository()
  const offerRepository = new PrismaOfferRepository()
  const appointmentRepository = new PrismaAppointmentRepository()
  const professionalRepository = new PrismaProfessionalRepository()
  const usecase = new AnalyticsUseCase(
    ratingsRepository, 
    serviceRepository, 
    offerRepository, 
    appointmentRepository, 
    professionalRepository
  )
  return usecase
}

export { makeAnalyticsUseCaseFactory }