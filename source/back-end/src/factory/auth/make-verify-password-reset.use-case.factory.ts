import { PrismaCustomerRepository } from '@/repository/prisma/prisma-customer.repository'
import { PrismaProfessionalRepository } from '@/repository/prisma/prisma-professional.repository'
import { RedisCacheProvider } from '@/services/cache/redis-cache-provider.service'
import { CodeValidationService } from '@/services/use-cases/auth/services/code-validation.service'
import { PasswordResetTicketService } from '@/services/use-cases/auth/services/password-reset-ticket.service'
import { VerifyPasswordResetUseCase } from '@/services/use-cases/auth/verify-password-reset.use-case'

export function makeVerifyPasswordResetUseCase () {
  const customerRepository = new PrismaCustomerRepository()
  const professionalRepository = new PrismaProfessionalRepository()
  const cache = new RedisCacheProvider()
  const codeService = new CodeValidationService(cache)
  const ticketService = new PasswordResetTicketService(cache)

  return new VerifyPasswordResetUseCase(customerRepository, professionalRepository, codeService, ticketService)
}
