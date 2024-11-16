import { Router } from 'express'
import { GenerateGoogleRedirectUriController } from '../../controllers/generate-google-redirect-uri.controller'

const authRoutes = Router()

authRoutes.get('/google/redirect-uri', GenerateGoogleRedirectUriController.handle)
authRoutes.post('/customer')


// app.get('/auth/google/callback', async (req, res) => {
//   const error = req.query.error as string | undefined
//   const code = req.query.code as string | undefined

//   if (error != null) {
//     console.log('Error trying to do Google OAuth Flow: ' + error)
//     res.status(500).send()
//     return
//   }

//   if (code == null) {
//     console.log('Error trying to do Google OAuth Flow: code query param not exists')
//     res.status(500).send()
//     return
//   }

//   const { tokens } = await oauth2Client.getToken(code)
//   oauth2Client.setCredentials(tokens)
//   // eslint-disable-next-line @typescript-eslint/non-nullable-type-assertion-style
//   console.log(await oauth2Client.getTokenInfo(tokens.access_token as string))
//   // await oauth2Client.verifySignedJwtWithCertsAsync(tokens.access_token, oauth2Client.get)
//   res.status(200).send({ tokens })
// })

// app.use(cors({
//   origin: '*'
// }))
