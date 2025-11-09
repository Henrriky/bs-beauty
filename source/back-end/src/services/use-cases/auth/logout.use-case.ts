import { type RefreshTokenService } from '@/services/encrypter/refresh-token.service'

class LogoutUseCase {
  constructor (
    private readonly refreshTokens: RefreshTokenService
  ) { }

  async execute (refreshToken: string) {
    if (refreshToken) {
      await this.refreshTokens.revokeByJwt(refreshToken)
    }

    return true
  }
}

export { LogoutUseCase }
