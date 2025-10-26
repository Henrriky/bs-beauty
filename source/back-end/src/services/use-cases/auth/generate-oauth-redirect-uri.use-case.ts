import { type OAuthIdentityProvider } from '../../protocols/oauth-identity-provider.protocol'

interface GenerateOAuthRedirectUriUseCaseOutput { authorizationUrl: string }

class GenerateOAuthRedirectUriUseCase {
  constructor (
    private readonly identityProvider: OAuthIdentityProvider
  ) {
  }

  execute (): GenerateOAuthRedirectUriUseCaseOutput {
    const authorizationUrl = this.identityProvider.generateRedirectUri()
    return { authorizationUrl }
  }
}

export { GenerateOAuthRedirectUriUseCase }
