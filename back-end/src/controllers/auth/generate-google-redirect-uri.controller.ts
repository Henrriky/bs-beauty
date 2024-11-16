import { type Response, type Request } from 'express'
import { GenerateOAuthRedirectUriUseCase } from '../../services/use-cases/generate-oauth-redirect-uri.use-case'
import { GoogleAuthIdentityProvider } from '../../services/identity-providers/google-oauth-identity-provider.service'

class GenerateGoogleRedirectUriController {
  public static async handle (req: Request, res: Response) {
    try {
      const service = new GenerateOAuthRedirectUriUseCase(
        new GoogleAuthIdentityProvider()
      )
      const { authorizationUrl } = service.execute()

      res.status(200).send({ authorizationUrl })
    } catch (error: any) {
      console.error(`Error trying to generate google redirect uri.\nReason: ${error?.message}`)
      res.status(500).send({ message: 'Error trying to generate google redirect uri, please check back-end logs...' })
    }
  }
}

export { GenerateGoogleRedirectUriController }
