import 'dotenv/config'

const ENV = {
  GOOGLE: {
    CLIENT_ID: process.env.GOOGLE_CLIENT_ID ?? new Error('Please, define GOOGLE_CLIENT_ID enviroment variable'),
    CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET ?? new Error('Please, define GOOGLE_CLIENT_SECRET enviroment variable'),
    REDIRECT_URI: process.env.GOOGLE_REDIRECT_URI ?? new Error('Please, define GOOGLE_REDIRECT_URI enviroment variable'),
    SCOPES: process.env.GOOGLE_SCOPES?.split(',') ?? new Error('Please, define GOOGLE_SCOPES enviroment variable')
  }
}

export { ENV }
