import { PrismaServiceRepository } from '@/repository/prisma/prisma-service.repository'
import { PrismaAppointmentRepository } from '../repository/prisma/prisma-appointment.repository'
import { PrismaOfferRepository } from '../repository/prisma/prisma-offer.repository'
import { PrismaShiftRepository } from '../repository/prisma/prisma-shift.repository'
import { OffersUseCase } from '../services/offers.use-case'

function makeOffersUseCaseFactory () {
  const offerRepository = new PrismaOfferRepository()
  const shiftRepository = new PrismaShiftRepository()
  const appointmentRepository = new PrismaAppointmentRepository()
  const serviceRepository = new PrismaServiceRepository()
  const useCase = new OffersUseCase(offerRepository, shiftRepository, appointmentRepository, serviceRepository)

  return useCase
}

export { makeOffersUseCaseFactory }
