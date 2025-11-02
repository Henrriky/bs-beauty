import { RedisCacheProvider } from "@/services/cache/redis-cache-provider.service"
import { RefreshTokenService } from "@/services/encrypter/refresh-token.service"
import { LogoutUseCase } from "@/services/use-cases/auth/logout.use-case"

function makeLogoutUseCase() {
  const cache = new RedisCacheProvider()
  const refreshTokenService = new RefreshTokenService(cache)
  const usecase = new LogoutUseCase(refreshTokenService)

  return usecase
}

export { makeLogoutUseCase }