import 'dotenv/config'
import { z } from 'zod'

const envSchema = z.object({
  GOOGLE_CLIENT_ID: z.string(),
  GOOGLE_CLIENT_SECRET: z.string(),
  GOOGLE_REDIRECT_URI: z.string(),
  GOOGLE_SCOPES: z.string(),
  JWT_SECRET: z.string(),
  JWT_EXPIRES_IN: z.string()
})

const _env = envSchema.safeParse(process.env)

if (!_env.success) {
  console.error('❌ Invalid enviroment variables', _env.error.format())

  throw new Error('❌ Invalid enviroment variables.')
}

export const ENV = _env.data
