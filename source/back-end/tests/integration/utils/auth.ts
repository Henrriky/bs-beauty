import jwt from 'jsonwebtoken';
import { TokenPayload } from '../../../src/middlewares/auth/verify-jwt-token.middleware';

export function getManagerToken(secret = process.env.JWT_SECRET as string) {
  if (!secret) throw new Error('JWT_SECRET is not set');
  return jwt.sign({ sub: 'test-user-id', userType: 'MANAGER' }, secret, { expiresIn: '1h' });
}

export function signToken(payload: TokenPayload, secret = process.env.JWT_SECRET as string) {
  if (!secret) throw new Error('JWT_SECRET ausente nos testes.')
  return jwt.sign(payload, secret, { expiresIn: '1h' })
}