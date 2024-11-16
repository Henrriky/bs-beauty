import { ENV } from '../../../config/env'
import { oauth2Client } from '../../../lib/google'

interface GenerateGoogleRedirectUriServiceOutput { authorizationUrl: string }

class GenerateGoogleRedirectUriService {
  execute (): GenerateGoogleRedirectUriServiceOutput {
    const authorizationUrl = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: ENV.GOOGLE.SCOPES as string[],
      include_granted_scopes: true
    })

    return { authorizationUrl }
  }
}

export { GenerateGoogleRedirectUriService }
