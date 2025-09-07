import { PrismaCustomerRepository } from '@/repository/prisma/prisma-customer.repository'
import { RedisCacheProvider } from '@/services/cache/redis-cache-provider.service'
import { VerifyUserUseCase } from '@/services/use-cases/auth/verify-user.use-case'
import { CodeValidationService } from '../../services/use-cases/auth/code-validation.service'

export function makeVerifyCustomerUseCase() {
  const customerRepository = new PrismaCustomerRepository()
  const cache = new RedisCacheProvider()
  const codeValidation = new CodeValidationService(cache)

  return new VerifyUserUseCase(customerRepository, codeValidation)
}
