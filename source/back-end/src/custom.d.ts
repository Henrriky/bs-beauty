import { type TokenPayload } from './middlewares/auth/verify-jwt-token.middleware'

declare global {
  namespace Express {
    export interface Request {
      user: TokenPayload
    }
  }
}
