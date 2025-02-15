import { CustomerOrEmployee } from '../store/auth/types'
import jwt from 'jsonwebtoken'
import { jwtDecode } from 'jwt-decode'

export interface TokenPayload extends jwt.JwtPayload, CustomerOrEmployee {}

export const decodeUserToken = (token: string): TokenPayload => {
  const decoded = jwtDecode<TokenPayload>(token)
  return decoded
}
