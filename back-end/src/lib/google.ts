import { google } from 'googleapis'
import { ENV } from '../config/env'

const oauth2Client = new google.auth.OAuth2(
  ENV.GOOGLE.CLIENT_ID as string,
  ENV.GOOGLE.CLIENT_SECRET as string,
  ENV.GOOGLE.REDIRECT_URI as string
)

export { oauth2Client }
