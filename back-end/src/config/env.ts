import 'dotenv/config'

const ENV = {
  GOOGLE: {
    CLIENT_ID: process.env.CLIENT_ID ?? new Error('Please, define CLIENT_ID enviroment variable')
  }
}

export { ENV }
