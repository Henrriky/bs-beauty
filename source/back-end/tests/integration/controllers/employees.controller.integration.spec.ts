import { Employee } from '@prisma/client';
import request from 'supertest';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { app } from '../../../src/app';
import { truncateAll } from '../../test-env.integration';
import { getManagerToken } from '../utils/auth';
import { spyEmployeesWiring } from '../utils/employees-spies';
import { faker } from '@faker-js/faker'

describe('EmployeesController', () => {
  let token: string;

  beforeEach(async () => {
    await truncateAll();
    vi.restoreAllMocks();  
    token = getManagerToken();
  });

  describe('handleFindAll - [GET /api/employees]', () => {
    it('should return a list of employees', async () => {
      // arrange
      const employee1 = await createEmployee();
      const employee2 = await createEmployee();

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
        expect.arrayContaining([employee1.email, employee2.email])
      );

      expect(spies.usecase.executeFindAllPaginated).toHaveBeenCalledTimes(1);
      expect(spies.repository.findAllPaginated).toHaveBeenCalledTimes(1);
    })

    it('should return a list of employees when email filter is set', async () => {
      // arrange
      const targetEmployee = await createEmployee()
      await createEmployee()

      // act
      const response = await request(app)
        .get('/api/employees')
        .set('Authorization', `Bearer ${token}`)
        .query({ email: targetEmployee.email })

      expect(response.status).toBe(200)
      expect(response.body.data).toHaveLength(1)
      expect(response.body.data[0]).toMatchObject({ id: targetEmployee.id, email: targetEmployee.email })

      expect(response.status).toBe(200)
      const { data } = response.body
      expect(Array.isArray(data)).toBe(true)
      expect(data).toHaveLength(1)
      expect(data[0]).toMatchObject({ id: targetEmployee.id, email: targetEmployee.email })
    })

    it('should return a list of employees when name filter is set', async () => {
      // arrange
      const targetEmployee = await createEmployee()
      const newName = 'Updated name'
      const spies = spyEmployeesWiring();
      await createEmployee()

      await request(app).put(`/api/employees/${targetEmployee.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ name: newName })

      // act
      const response = await request(app)
        .get('/api/employees')
        .set('Authorization', `Bearer ${token}`)
        .query({ name: 'Updated name' })


      // assert
      expect(response.status).toBe(200)
      expect(response.body.data).toHaveLength(1)
      expect(response.body.data[0]).toMatchObject({ id: targetEmployee.id, name: newName })

      expect(response.status).toBe(200)
      const { data } = response.body
      expect(Array.isArray(data)).toBe(true)
      expect(data).toHaveLength(1)
      expect(data[0]).toMatchObject({ id: targetEmployee.id, email: targetEmployee.email })
      expect(spies.usecase.executeFindAllPaginated).toHaveBeenCalledTimes(1);
      expect(spies.repository.findAllPaginated).toHaveBeenCalledTimes(1);
    })

  })

  describe('handleFindById', () => {
    it('should return an employee by id', async () => {
      // arrange
      const { id } = await createEmployee();

      const spies = spyEmployeesWiring();

      // act
      const response = await request(app)
        .get(`/api/employees/${id}`)
        .set('Authorization', `Bearer ${token}`);

      // assert
      expect(response.status).toBe(200)
      expect(spies.repository.findById).toHaveBeenCalledTimes(1);
      expect(spies.usecase.executeFindById).toHaveBeenCalledTimes(1);
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

    it('should create an employee and throw a bad request when attempting to create an employee with an email that is already in use', async () => {
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

  describe('handleUpdate', () => {
    it('should update an employee', async () => {
      // arrange
      const { id } = await createEmployee();

      const updatedEmail = faker.internet.email();
      const updatedName = faker.person.fullName();

      const spies = spyEmployeesWiring();

      // act
      const response = await request(app)
        .put(`/api/employees/${id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ email: updatedEmail, name: updatedName });

      // assert
      expect(response.status).toBe(200);
      expect(response.body).toMatchObject({ id, email: updatedEmail, name: updatedName });
      expect(spies.repository.update).toHaveBeenCalledTimes(1);
      expect(spies.repository.update).toHaveBeenCalledWith(id, expect.objectContaining({ email: updatedEmail, name: updatedName }));
      expect(spies.usecase.executeUpdate).toHaveBeenCalledTimes(1);
      expect(spies.usecase.executeUpdate).toHaveBeenCalledWith(id, expect.objectContaining({ email: updatedEmail, name: updatedName }));

    });
  })

  describe('handleDelete', () => {
    it('should create and delete an employee', async () => {
      // arrange
      const { id } = await createEmployee();

      const spies = spyEmployeesWiring();

      // act
      const response = await request(app)
        .delete(`/api/employees/${id}`)
        .set('Authorization', `Bearer ${token}`)
        .send();

      // assert
      expect(response.status).toBe(200);
      expect(spies.repository.delete).toHaveBeenCalledTimes(1);
      expect(spies.usecase.executeDelete).toHaveBeenCalledTimes(1);
    });
  })

  async function createEmployee() {
    const email = faker.internet.email()

    const createResponse = await request(app)
      .post('/api/employees')
      .set('Authorization', `Bearer ${token}`)
      .send({ email })

    expect(createResponse.status).toBe(201)
    const created = createResponse.body
    expect(created).toHaveProperty('id')

    return {
      id: created.id,
      email
    } as Employee
  }

});
