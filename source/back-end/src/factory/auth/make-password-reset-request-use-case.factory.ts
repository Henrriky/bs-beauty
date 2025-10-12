import { CodeValidationService } from '@/services/use-cases/auth/code-validation.service'
import { PasswordResetRequestUseCase } from '@/services/use-cases/auth/password-reset-request.use-case'
import { PrismaCustomerRepository } from '../../repository/prisma/prisma-customer.repository'
import { EmailService } from '@/services/email/email.service'
import { RedisCacheProvider } from '@/services/cache/redis-cache-provider.service'
import { PrismaProfessionalRepository } from '@/repository/prisma/prisma-professional.repository'

function makePasswordResetRequestUseCase () {
  const customerRepository = new PrismaCustomerRepository()
  const professionalRepository = new PrismaProfessionalRepository()
  const cache = new RedisCacheProvider()
  const codeValidationService = new CodeValidationService(cache)
  const emailService = new EmailService()
  const usecase = new PasswordResetRequestUseCase(
    customerRepository,
    professionalRepository,
    codeValidationService,
    emailService
  )

  return usecase
}

export { makePasswordResetRequestUseCase }
