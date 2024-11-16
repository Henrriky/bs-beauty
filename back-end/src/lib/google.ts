import { google } from 'googleapis'
import { ENV } from '../config/env'

const oauth2Client = new google.auth.OAuth2(
  ENV.GOOGLE_CLIENT_ID,
  ENV.GOOGLE_CLIENT_SECRET,
  ENV.GOOGLE_REDIRECT_URI
)

export { oauth2Client }
