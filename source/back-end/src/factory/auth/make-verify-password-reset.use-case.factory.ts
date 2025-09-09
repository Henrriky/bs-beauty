import { PrismaCustomerRepository } from '@/repository/prisma/prisma-customer.repository'
import { RedisCacheProvider } from '@/services/cache/redis-cache-provider.service'
import { CodeValidationService } from '@/services/use-cases/auth/code-validation.service'
import { PasswordResetTicketService } from '@/services/use-cases/auth/password-reset-ticket.service'
import { VerifyPasswordResetUseCase } from '@/services/use-cases/auth/verify-password-reset.use-case'

export function makeVerifyPasswordResetUseCase() {
  const customers = new PrismaCustomerRepository()
  const cache = new RedisCacheProvider()
  const codeSvc = new CodeValidationService(cache)
  const ticketSvc = new PasswordResetTicketService(cache)

  return new VerifyPasswordResetUseCase(customers, codeSvc, ticketSvc)
}
