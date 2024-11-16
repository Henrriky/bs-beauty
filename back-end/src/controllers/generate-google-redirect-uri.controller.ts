import { type Response, type Request } from 'express'
import { GenerateGoogleRedirectUriService } from '../services/external/google/generate-google-redirect-uri.service'

class GenerateGoogleRedirectUriController {
  public static async handle (req: Request, res: Response) {
    try {
      const service = new GenerateGoogleRedirectUriService()
      const { authorizationUrl } = service.execute()

      res.send({ authorizationUrl })
    } catch (error: any) {
      console.error(`Error trying to generate google redirect uri.\nReason: ${error?.message}`)
      res.send({ message: 'Error trying to generate google redirect uri, please check back-end logs...' })
    }
  }
}

export { GenerateGoogleRedirectUriController }
