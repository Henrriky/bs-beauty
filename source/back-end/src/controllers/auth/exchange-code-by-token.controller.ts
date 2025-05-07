import { type Response, type Request } from 'express'
import { GoogleAuthIdentityProvider } from '../../services/identity-providers/google-oauth-identity-provider.service'
import { ExchangeCodeByTokenUseCase } from '../../services/use-cases/auth/exchange-code-by-token.use-case'
import { z } from 'zod'
import { formatValidationErrors } from '../../utils/formatting/zod-validation-errors.formatting.util'


const exchangeCodeByTokenBodySchema = z.object({
  code: z.string()
})

class ExchangeCodeByTokenController {
  public static async handle (req: Request, res: Response) {
    try {
      const { code } = exchangeCodeByTokenBodySchema.parse(req.body)

      const service = new ExchangeCodeByTokenUseCase(
        new GoogleAuthIdentityProvider()
      )
      const { accessToken } = await service.execute({
        code
      })

      res.status(200).send({ accessToken })
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        formatValidationErrors(error, res)
        return
      }
      console.error(`Error trying to ExchangeCodeByTokenController.\nReason: ${error?.message}`)
      res.status(500).send({ message: 'Error trying to exchange code by token, please check back-end logs...' })
    }
  }
}

export { ExchangeCodeByTokenController }
