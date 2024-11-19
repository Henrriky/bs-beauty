
import { CustomerOrEmployee } from '../store/auth/types';
import jwt from 'jsonwebtoken';

interface TokenPayload extends jwt.JwtPayload, CustomerOrEmployee {}

export const decodeUserToken = (token: string): TokenPayload => {
  const decoded = jwt.decode(token) as TokenPayload
  return decoded;
}