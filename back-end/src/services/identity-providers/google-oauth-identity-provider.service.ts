import { ENV } from '../../config/env'
import { oauth2Client } from '../../lib/google'
import { type OAuthIdentityProvider } from '../protocols/oauth-identity-provider.protocol'

class GoogleAuthIdentityProvider implements OAuthIdentityProvider {
  async fetchEmailAndUserIdFromToken (token: string): Promise<{ userId: string, email: string }> {
    const tokenInfo = await oauth2Client.getTokenInfo(token)
    const { email, sub: userId } = tokenInfo

    if ((email == null) || (userId == null)) {
      throw new Error('Email or user id not exists on google token')
    }

    return { userId: userId, email: email }
  }

  generateRedirectUri () {
    const authorizationUrl = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: ENV.GOOGLE_SCOPES.split(','),
      include_granted_scopes: true
    })

    return authorizationUrl
  }
}

export { GoogleAuthIdentityProvider }
