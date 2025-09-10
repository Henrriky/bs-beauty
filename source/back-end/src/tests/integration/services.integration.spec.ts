import request from 'supertest'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { app } from '../../app'
import { getProfessionalToken } from './utils/auth'
import { type Service } from '@prisma/client'
import { spyServicesWiring } from './utils/services-spies'
import { ServiceFactory } from './factories/service.factory'

describe('Services API (Integration Test)', () => {
  let token: string

  beforeEach(async () => {
    vi.restoreAllMocks()
    const { token: professionalToken } = await getProfessionalToken()
    token = professionalToken
  })

  describe('[GET] /api/services', () => {
    it('should return a list of services', async () => {
      // arrange
      const service1 = await ServiceFactory.makeService({
        name: 'First Service',
        category: 'First category'
      })
      const service2 = await ServiceFactory.makeService({
        name: 'Second Service',
        category: 'Second category'
      })
      const service3 = await ServiceFactory.makeService({
        name: 'Third Service',
        category: 'Third category'
      })
      const spies = spyServicesWiring()

      // act
      const response = await request(app)
        .get('/api/services')
        .set('Authorization', `Bearer ${token}`)
        .query({ page: 1, limit: 10 })

      const { data } = response.body

      // assert
      expect(response.status).toBe(200)
      expect(response.body.data).toHaveLength(3)
      expect(data.map((e: Service) => e.name)).toEqual(
        expect.arrayContaining([service1.name, service2.name, service3.name])
      )

      expect(spies.usecase.executeFindAllPaginated).toHaveBeenCalledTimes(1)
      expect(spies.repository.findAllPaginated).toHaveBeenCalledTimes(1)
    })
  })

  describe('[GET] /api/services/:id', () => {
    it('should find service by id', async () => {
      // arrange
      const service = await ServiceFactory.makeService({
        name: 'Service to find',
        category: 'Category'
      })
      const spies = spyServicesWiring()

      // act
      const response = await request(app)
        .get(`/api/services/${service.id}`)
        .set('Authorization', `Bearer ${token}`)

      // assert
      expect(response.status).toBe(200)
      expect(response.body).toEqual(expect.objectContaining({
        id: service.id,
        name: service.name,
        category: service.category
      }))

      expect(spies.usecase.executeFindById).toHaveBeenCalledTimes(1)
      expect(spies.repository.findById).toHaveBeenCalledTimes(1)
    })
  })

  describe('[POST] /api/services', () => {
    it('should create a new service', async () => {
      // arrange
      const spies = spyServicesWiring()

      // act
      const response = await request(app)
        .post('/api/services')
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'New Service',
          category: 'New Category'
        })

      // assert
      expect(response.status).toBe(200)
      expect(spies.usecase.executeCreate).toHaveBeenCalledTimes(1)
      expect(spies.repository.create).toHaveBeenCalledTimes(1)
    })

    it('should throw an validation error when invalid data is provided', async () => {
      // arrange
      const spies = spyServicesWiring()

      // act
      const response = await request(app)
        .post('/api/services')
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: '',
          category: ''
        })

      // assert
      expect(response.status).toBe(400)
      expect(spies.usecase.executeCreate).toHaveBeenCalledTimes(0)
      expect(spies.repository.create).toHaveBeenCalledTimes(0)
    })
  })

  describe('[PUT] /api/services/:id', () => {
    it('should update a service', async () => {
      // arrange
      const service = await ServiceFactory.makeService({
        name: 'Service to update',
        category: 'Category'
      })
      const spies = spyServicesWiring()

      // act
      const response = await request(app)
        .put(`/api/services/${service.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'Updated Service',
          category: 'Updated Category'
        })

      // assert
      expect(response.status).toBe(200)
      expect(spies.usecase.executeUpdate).toHaveBeenCalledTimes(1)
      expect(spies.repository.update).toHaveBeenCalledTimes(1)
    })
  })

  describe('[DELETE] /api/services/:id', () => {
    it('should delete a service', async () => {
      // arrange
      const service = await ServiceFactory.makeService({
        name: 'Service to delete',
        category: 'Category'
      })
      const spies = spyServicesWiring()

      // act
      const response = await request(app)
        .delete(`/api/services/${service.id}`)
        .set('Authorization', `Bearer ${token}`)

      // assert
      expect(response.status).toBe(200)

      expect(spies.usecase.executeDelete).toHaveBeenCalledTimes(1)
      expect(spies.repository.delete).toHaveBeenCalledTimes(1)
    })
  })
})
