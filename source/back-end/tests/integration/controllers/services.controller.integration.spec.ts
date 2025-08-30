import request from 'supertest';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { app } from '../../../src/app';
import { truncateAll } from '../../test-env.integration';
import { getManagerToken } from '../utils/auth';
import { Service } from '@prisma/client';
import { spyServicesWiring } from '../utils/services-spies';

describe('ServicesController', () => {
  let token: string;

  beforeEach(async () => {
    await truncateAll();
    vi.restoreAllMocks();
    token = getManagerToken();
  });

  describe('handleFindAllPaginated', () => {
    it('should return a list of services', async () => {
      // arrange
      const service1 = await createShift('First Service', 'First category');
      const service2 = await createShift('Second Service', 'Second category');
      const service3 = await createShift('Third Service', 'Third category');
      const spies = spyServicesWiring();

      // act
      const response = await request(app)
        .get('/api/services')
        .set('Authorization', `Bearer ${token}`)
        .query({ page: 1, limit: 10 });

      const { data } = response.body;

      // assert
      expect(response.status).toBe(200);
      expect(response.body.data).toHaveLength(3);
      expect(data.map((e: Service) => e.name)).toEqual(
        expect.arrayContaining([service1.name, service2.name, service3.name])
      );

      expect(spies.usecase.executeFindAllPaginated).toHaveBeenCalledTimes(1);
      expect(spies.repository.findAllPaginated).toHaveBeenCalledTimes(1);
    });
  });

  describe('handleFindById', () => {
    it('should find service by id', async () => {
      // arrange
      const service = await createShift('Service to find', 'Category');
      const spies = spyServicesWiring();

      // act
      const response = await request(app)
        .get(`/api/services/${service.id}`)
        .set('Authorization', `Bearer ${token}`);

      // assert
      expect(response.status).toBe(200);
      expect(response.body).toEqual(expect.objectContaining({
        id: service.id,
        name: service.name,
        category: service.category
      }));

      expect(spies.usecase.executeFindById).toHaveBeenCalledTimes(1);
      expect(spies.repository.findById).toHaveBeenCalledTimes(1);
    });
  });

  describe('handleCreate', () => {
    it('should create a new service', async () => {
      // arrange
      const spies = spyServicesWiring();

      // act
      const response = await request(app)
        .post('/api/services')
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'New Service',
          category: 'New Category'
        });

      // assert
      expect(response.status).toBe(200);
      expect(spies.usecase.executeCreate).toHaveBeenCalledTimes(1);
      expect(spies.repository.create).toHaveBeenCalledTimes(1);
    });

    it('should throw an validation error when invalid data is provided', async () => {
      // arrange
      const spies = spyServicesWiring();

      // act
      const response = await request(app)
        .post('/api/services')
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: '',
          category: ''
        });

      // assert
      expect(response.status).toBe(400);
      expect(spies.usecase.executeCreate).toHaveBeenCalledTimes(0);
      expect(spies.repository.create).toHaveBeenCalledTimes(0);
    });

  });

  describe('handleUpdate', () => {
    it('should update a service', async () => {
      // arrange
      const service = await createShift('Service to update', 'Category');
      const spies = spyServicesWiring();

      // act
      const response = await request(app)
        .put(`/api/services/${service.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'Updated Service',
          category: 'Updated Category'
        });

      // assert
      expect(response.status).toBe(200);
      expect(spies.usecase.executeUpdate).toHaveBeenCalledTimes(1);
      expect(spies.repository.update).toHaveBeenCalledTimes(1);
    });
  });

  describe('handleDelete', () => {
    it('should delete a service', async () => {
      // arrange
      const service = await createShift('Service to delete', 'Category');
      const spies = spyServicesWiring();

      // act
      const response = await request(app)
        .delete(`/api/services/${service.id}`)
        .set('Authorization', `Bearer ${token}`);

      // assert
      expect(response.status).toBe(200);

      expect(spies.usecase.executeDelete).toHaveBeenCalledTimes(1);
      expect(spies.repository.delete).toHaveBeenCalledTimes(1);
    });
  });

  async function createShift(name: string, category: string) {

    const createResponse = await request(app)
      .post('/api/services')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name,
        category
      });

    return {
      id: createResponse.body.id,
      name: createResponse.body.name,
      category: createResponse.body.category
    }
  }

});
