import { ENV } from '../../config/env'
import { oauth2Client } from '../../lib/google'
import { type OAuthIdentityProvider } from '../protocols/oauth-identity-provider.protocol'

class GoogleAuthIdentityProvider implements OAuthIdentityProvider {
  async fetchUserInformationsFromToken (token: string): Promise<{ userId: string, email: string, profilePhotoUrl: string }> {
    this.updateCredentials(token)

    const tokenInfo = await oauth2Client.getTokenInfo(token)
    const { email, sub: userId } = tokenInfo

    if ((email == null) || (userId == null)) {
      throw new Error('Email or user id not exists on google token')
    }

    const userInfoResponse = await oauth2Client.request({
      url: 'https://www.googleapis.com/oauth2/v3/userinfo',
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    const { picture: profilePhotoUrl } = userInfoResponse.data as { picture?: string }

    if (profilePhotoUrl == null) {
      throw new Error('Profile photo url not exists on google user info')
    }


    return { userId, email, profilePhotoUrl }
  }

  async exchangeCodeByToken (code: string): Promise<{ accessToken: string }> {
    const { tokens } = await oauth2Client.getToken(code)
    oauth2Client.setCredentials(tokens)

    if (tokens.access_token == null) {
      throw new Error(`Error trying to exchange code by token: access_token property null or undefined ${tokens}`)
    }

    return { accessToken: tokens.access_token }
  }

  private updateCredentials (accessToken: string): void {
    oauth2Client.setCredentials({
      access_token: accessToken,
    })
  }

  generateRedirectUri () {
    const authorizationUrl = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: ENV.GOOGLE_SCOPES.split(','),
      include_granted_scopes: true,
      redirect_uri: ENV.GOOGLE_REDIRECT_URI
    })

    return authorizationUrl
  }
}

export { GoogleAuthIdentityProvider }
