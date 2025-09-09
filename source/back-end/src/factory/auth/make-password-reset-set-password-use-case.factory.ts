import { PrismaCustomerRepository } from '@/repository/prisma/prisma-customer.repository'
import { RedisCacheProvider } from '@/services/cache/redis-cache-provider.service'
import { PasswordResetTicketService } from '@/services/use-cases/auth/password-reset-ticket.service'
import { PasswordResetSetPasswordUseCase } from '@/services/use-cases/auth/password-reset-set-password.use-case'

function makePasswordResetSetPasswordUseCase() {
  const customers = new PrismaCustomerRepository()
  const cache = new RedisCacheProvider()
  const ticketSvc = new PasswordResetTicketService(cache)
  return new PasswordResetSetPasswordUseCase(customers, ticketSvc)
}
export { makePasswordResetSetPasswordUseCase }
