import { PrismaCustomerRepository } from '../../repository/prisma/prisma-customer.repository'
import { PrismaProfessionalRepository } from '../../repository/prisma/prisma-professional.repository'
import { CompleteUserRegisterUseCase } from '../../services/use-cases/auth/complete-user-register.use-case'

function makeCompleteUserRegisterUseCase() {
  const customerRepository = new PrismaCustomerRepository()
  const professionalRepository = new PrismaProfessionalRepository()
  const usecase = new CompleteUserRegisterUseCase(
    customerRepository,
    professionalRepository
  )

  return usecase
}

export { makeCompleteUserRegisterUseCase }
