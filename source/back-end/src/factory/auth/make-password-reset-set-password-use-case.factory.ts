import { PrismaCustomerRepository } from '@/repository/prisma/prisma-customer.repository'
import { PrismaProfessionalRepository } from '@/repository/prisma/prisma-professional.repository'
import { RedisCacheProvider } from '@/services/cache/redis-cache-provider.service'
import { PasswordResetSetPasswordUseCase } from '@/services/use-cases/auth/password-reset-set-password.use-case'
import { PasswordResetTicketService } from '@/services/use-cases/auth/password-reset-ticket.service'

function makePasswordResetSetPasswordUseCase() {
  const customerRepository = new PrismaCustomerRepository()
  const professionalRepository = new PrismaProfessionalRepository()
  const cache = new RedisCacheProvider()
  const ticketService = new PasswordResetTicketService(cache)
  return new PasswordResetSetPasswordUseCase(customerRepository, professionalRepository, ticketService)
}
export { makePasswordResetSetPasswordUseCase }
