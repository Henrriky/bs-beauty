import { PrismaCustomerRepository } from '@/repository/prisma/prisma-customer.repository'
import { RedisCacheProvider } from '@/services/cache/redis-cache-provider.service'
import { VerifyUserUseCase } from '@/services/use-cases/auth/verify-user.use-case'
import { CodeVerificationService } from '../../services/use-cases/auth/code-verification.service'

export function makeVerifyCustomerUseCase() {
  const customerRepository = new PrismaCustomerRepository()
  const cache = new RedisCacheProvider()
  const codeVerification = new CodeVerificationService(cache)

  return new VerifyUserUseCase(customerRepository, codeVerification)
}
