import { RedisCacheProvider } from '@/services/cache/redis-cache-provider.service'
import { EmailService } from '@/services/email/email.service'
import { CodeValidationService } from '@/services/use-cases/auth/services/code-validation.service'
import { PrismaCustomerRepository } from '../../repository/prisma/prisma-customer.repository'
import { PrismaProfessionalRepository } from '../../repository/prisma/prisma-professional.repository'
import { RegisterUserUseCase } from '../../services/use-cases/auth/register-user.use-case'

const makeRegisterUserUseCase = () => {
  const customerRepo = new PrismaCustomerRepository()
  const professionalRepo = new PrismaProfessionalRepository()
  const cacheService = new RedisCacheProvider()
  const codeVerificationService = new CodeValidationService(cacheService)
  const emailService = new EmailService()

  const usecase = new RegisterUserUseCase(
    customerRepo,
    professionalRepo,
    codeVerificationService,
    emailService
  )
  return usecase
}

export { makeRegisterUserUseCase }
