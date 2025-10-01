import { RefreshTokenService } from '@/services/encrypter/refresh-token.service'
import { PrismaCustomerRepository } from '../repository/prisma/prisma-customer.repository'
import { PrismaProfessionalRepository } from '../repository/prisma/prisma-professional.repository'
import { JwtEncrypterService } from '../services/encrypter/jwt-encrypter.service'
import { GoogleAuthIdentityProvider } from '../services/identity-providers/google-oauth-identity-provider.service'
import { LoginUseCase } from '../services/use-cases/auth/login.use-case'
import { RedisCacheProvider } from '@/services/cache/redis-cache-provider.service'

function makeLoginUseCase () {
  const customerRepository = new PrismaCustomerRepository()
  const professionalRepository = new PrismaProfessionalRepository()
  const encrypter = new JwtEncrypterService()
  const identityProvider = new GoogleAuthIdentityProvider()
  const cache = new RedisCacheProvider()
  const refreshTokenService = new RefreshTokenService(cache)
  const usecase = new LoginUseCase(
    customerRepository,
    professionalRepository,
    encrypter,
    identityProvider,
    refreshTokenService
  )

  return usecase
}

export { makeLoginUseCase }
