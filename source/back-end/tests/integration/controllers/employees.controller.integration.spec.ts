import request from 'supertest';
import { beforeEach, describe, expect, it } from 'vitest';
import { truncateAll } from '../../test-env';
import { app } from '../../../src/app';
import jwt from 'jsonwebtoken'

describe('EmployeesController (integração)', () => {
  let token: string;

  beforeEach(async () => {
    await truncateAll();
    token = getTestToken();
  });

  describe('handleCreate', () => {
    it('should create an employee', async () => {
      const createRes = await request(app)
        .post('/api/employees')
        .set('Authorization', `Bearer ${token}`)
        .send({
          email: 'john.test@example.com',
        });

      expect(createRes.status).toBe(201);
      const created = createRes.body;
      console.log(created);
      expect(created).toHaveProperty('id');
    });
  })

});

function getTestToken() {

  const payload = {
    sub: 'test-user-id',
    userType: 'MANAGER',
  };

  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error('JWT_SECRET não encontrado. Garanta que .env.test foi carregado.');
  }

  return jwt.sign(payload, secret, { expiresIn: '1h' });
}