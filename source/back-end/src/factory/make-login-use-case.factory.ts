import { RefreshTokenService } from '@/services/encrypter/refresh-token.service'
import { PrismaCustomerRepository } from '../repository/prisma/prisma-customer.repository'
import { PrismaEmployeeRepository } from '../repository/prisma/prisma-employee.repository'
import { JwtEncrypterService } from '../services/encrypter/jwt-encrypter.service'
import { GoogleAuthIdentityProvider } from '../services/identity-providers/google-oauth-identity-provider.service'
import { LoginUseCase } from '../services/use-cases/auth/login.use-case'
import { RedisCacheProvider } from '@/services/cache/redis-cache-provider.service'

function makeLoginUseCase () {
  const customerRepository = new PrismaCustomerRepository()
  const employeeRepository = new PrismaEmployeeRepository()
  const encrypter = new JwtEncrypterService()
  const identityProvider = new GoogleAuthIdentityProvider()
  const cache = new RedisCacheProvider()
  const refreshTokenService = new RefreshTokenService(cache)
  const usecase = new LoginUseCase(
    customerRepository,
    employeeRepository,
    encrypter,
    identityProvider,
    refreshTokenService
  )

  return usecase
}

export { makeLoginUseCase }
