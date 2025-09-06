import jwt from 'jsonwebtoken'

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
export function getManagerToken (secret = process.env.JWT_SECRET!) {
  // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
  if (!secret) throw new Error('JWT_SECRET ausente nos testes.')
  return jwt.sign({ sub: 'test-user-id', userType: 'MANAGER' }, secret, { expiresIn: '1h' })
}
