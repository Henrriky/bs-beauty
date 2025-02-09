import path from 'path'
import express from 'express'
import cors from 'cors'
import { appRoutes } from './router'
import { oauth2Client } from './lib/google'


console.log(path.join(__dirname, '..', '..', 'front-end', 'build', 'index.html'))
const app = express()
app.use(cors({
  origin: '*'
}))
app.use(express.json())

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

app.use('/api', appRoutes)

app.use(express.static(path.join(__dirname, '..', '..', 'front-end', 'build')))
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', '..', 'front-end', 'build', 'index.html'))
})


app.listen(3000, () => {
  console.log(`HTTP Server listening on port ${3000}`)
})
