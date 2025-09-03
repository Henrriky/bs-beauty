import { PrismaAppointmentRepository } from '../repository/prisma/prisma-appointment.repository'
import { PrismaOfferRepository } from '../repository/prisma/prisma-offer.repository'
import { PrismaShiftRepository } from '../repository/prisma/prisma-shift.repository'
import { OffersUseCase } from '../services/offers.use-case'

function makeOffersUseCaseFactory () {
  const offerRepository = new PrismaOfferRepository()
  const shiftRepository = new PrismaShiftRepository()
  const appointmentRepository = new PrismaAppointmentRepository()
  const useCase = new OffersUseCase(offerRepository, shiftRepository, appointmentRepository)

  return useCase
}

export { makeOffersUseCaseFactory }
