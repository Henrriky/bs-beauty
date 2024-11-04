import express from 'express'
import cors from 'cors'
import { ENV } from './config/env'
import { oauth2Client } from './lib/google'

const app = express()

app.get('/auth/google/test', (req, res) => {
  const authorizationUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: ENV.GOOGLE.SCOPES as string[],
    include_granted_scopes: true
  })

  res.redirect(authorizationUrl)
})

app.get('/auth/google/callback', async (req, res) => {
  const error = req.query.error as string | undefined
  const code = req.query.code as string | undefined

  if (error != null) {
    console.log('Error trying to do Google OAuth Flow: ' + error)
    res.status(500).send()
    return
  }

  if (code == null) {
    console.log('Error trying to do Google OAuth Flow: code query param not exists')
    res.status(500).send()
    return
  }

  const { tokens } = await oauth2Client.getToken(code)
  oauth2Client.setCredentials(tokens)
  // eslint-disable-next-line @typescript-eslint/non-nullable-type-assertion-style
  console.log(await oauth2Client.getTokenInfo(tokens.access_token as string))
  // await oauth2Client.verifySignedJwtWithCertsAsync(tokens.access_token, oauth2Client.get)
  res.status(200).send({ tokens })
})

app.use(cors({
  origin: '*'
}))
app.use(express.json())

app.listen(3000, () => {
  console.log(`HTTP Server listening on port ${3000}`)
})
