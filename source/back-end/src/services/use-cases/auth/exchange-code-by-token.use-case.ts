import { type OAuthIdentityProvider } from '../../protocols/oauth-identity-provider.protocol'

interface ExchangeCodeByTokenUseCaseInput { code: string }
interface ExchangeCodeByTokenUseCaseOutput { accessToken: string }

class ExchangeCodeByTokenUseCase {
  constructor (
    private readonly identityProvider: OAuthIdentityProvider
  ) {
  }

  async execute (params: ExchangeCodeByTokenUseCaseInput): Promise<ExchangeCodeByTokenUseCaseOutput> {
    const { accessToken } = await this.identityProvider.exchangeCodeByToken(params.code)

    return { accessToken }
  }
}

export { ExchangeCodeByTokenUseCase }
