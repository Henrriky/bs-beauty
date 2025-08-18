import { Employee } from '@prisma/client';
import request from 'supertest';
import { beforeEach, describe, expect, it } from 'vitest';
import { app } from '../../../src/app';
import { truncateAll } from '../../test-env';
import { getManagerToken } from '../utils/auth';
import { spyEmployeesWiring } from '../utils/employees-spies';
import { faker } from '@faker-js/faker'

describe('EmployeesController (integração)', () => {
  let token: string;

  beforeEach(async () => {
    await truncateAll();
    token = getManagerToken();
  });

  describe('handleFindAll', () => {
    it('should return a list of employees', async () => {
      // arrange
      await request(app)
        .post('/api/employees')
        .set('Authorization', `Bearer ${token}`)
        .send({
          email: 'john.test@example.com',
        });

      await request(app)
        .post('/api/employees')
        .set('Authorization', `Bearer ${token}`)
        .send({
          email: 'john.test2@example.com',
        });

      const spies = spyEmployeesWiring();

      // act
      const response = await request(app)
        .get('/api/employees')
        .set('Authorization', `Bearer ${token}`)
        .query({ page: 1, limit: 10 });

      const { data } = response.body;

      // assert
      expect(response.status).toBe(200)
      expect(response.body.data).toHaveLength(2)
      expect(data.map((e: Employee) => e.email)).toEqual(
        expect.arrayContaining(['john.test@example.com', 'john.test2@example.com'])
      );

      expect(spies.usecase.executeFindAllPaginated).toHaveBeenCalledTimes(1);
      expect(spies.repository.findAllPaginated).toHaveBeenCalledTimes(1);
    })
  })

  describe('handleCreate', () => {
    it('should create an employee', async () => {
      // arrange
      const spies = spyEmployeesWiring();
      const email = faker.internet.email();

      // act
      const createdEmployeeResponse = await request(app)
        .post('/api/employees')
        .set('Authorization', `Bearer ${token}`)
        .send({
          email
        });

      // assert
      expect(createdEmployeeResponse.status).toBe(201);
      const createdEmployee = createdEmployeeResponse.body;
      expect(createdEmployee).toHaveProperty('id');

      expect(spies.usecase.executeCreate).toHaveBeenCalledTimes(1);
      expect(spies.usecase.executeCreate).toHaveBeenCalledWith(expect.objectContaining({ email }));
      expect(spies.repository.create).toHaveBeenCalledTimes(1);
      expect(spies.repository.create).toHaveBeenCalledWith(expect.objectContaining({ email }));
      expect(spies.repository.findByEmail).toHaveBeenCalledTimes(1);
      expect(spies.repository.findByEmail).toHaveBeenCalledWith(email);
    });

    it('should create an employee and throw a bad request when email is already in use', async () => {
      // arrange
      const spies = spyEmployeesWiring();
      const email = faker.internet.email();

      // act
      const createdEmployeeResponse = await request(app)
        .post('/api/employees')
        .set('Authorization', `Bearer ${token}`)
        .send({
          email
        });

      const duplicatedEmployeeResponse = await request(app)
        .post('/api/employees')
        .set('Authorization', `Bearer ${token}`)
        .send({
          email
        });

      // assert
      expect(createdEmployeeResponse.status).toBe(201);
      expect(duplicatedEmployeeResponse.status).toBe(400);
      expect(spies.usecase.executeCreate).toHaveBeenCalledTimes(2);
      expect(spies.usecase.executeCreate).toHaveBeenCalledWith(expect.objectContaining({ email }));
      expect(spies.repository.create).toHaveBeenCalledTimes(1);
      expect(spies.repository.create).toHaveBeenCalledWith(expect.objectContaining({ email }));
      expect(spies.repository.findByEmail).toHaveBeenCalledTimes(2);
      expect(duplicatedEmployeeResponse.body).toMatchObject({
        statusCode: 400,
        details: expect.stringMatching(/already exists/i),
      });
    });
  })

});
