import jwt from 'jsonwebtoken';

export function getManagerToken(secret = process.env.JWT_SECRET as string) {
  if (!secret) throw new Error('JWT_SECRET ausente nos testes.');
  return jwt.sign({ sub: 'test-user-id', userType: 'MANAGER' }, secret, { expiresIn: '1h' });
}
