import { type Professional } from '@prisma/client'
import request from 'supertest'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { app } from '../../app'
import { getProfessionalToken } from './utils/auth'
import { faker } from '@faker-js/faker'
import { spyProfessionalsWiring } from './utils/employees-spies'
import { ProfessionalFactory } from '../factories/professional.factory'

describe('Professionals API (Integration Test)', () => {
  let token: string

  beforeEach(async () => {
    vi.restoreAllMocks()
    const { token: professionalToken } = await getProfessionalToken()
    token = professionalToken
  })

  describe('[GET] /api/professionals', () => {
    it('should return a list of professionals', async () => {
      // arrange
      const professional1 = await ProfessionalFactory.makeProfessional()
      const professional2 = await ProfessionalFactory.makeProfessional()

      const spies = spyProfessionalsWiring()

      // act
      const response = await request(app)
        .get('/api/professionals')
        .set('Authorization', `Bearer ${token}`)
        .query({ page: 1, limit: 10 })

      const { data } = response.body

      // assert
      expect(response.status).toBe(200)
      expect(response.body.data).toHaveLength(3)
      expect(data.map((e: Professional) => e.email)).toEqual(
        expect.arrayContaining([professional1.email, professional2.email])
      )

      expect(spies.usecase.executeFindAllPaginated).toHaveBeenCalledTimes(1)
      expect(spies.repository.findAllPaginated).toHaveBeenCalledTimes(1)
    })

    it('should return a list of professionals when email filter is set', async () => {
      // arrange
      const targetProfessional = await ProfessionalFactory.makeProfessional()
      await ProfessionalFactory.makeProfessional()

      // act
      const response = await request(app)
        .get('/api/professionals')
        .set('Authorization', `Bearer ${token}`)
        .query({ email: targetProfessional.email })

      expect(response.status).toBe(200)
      expect(response.body.data).toHaveLength(1)
      expect(response.body.data[0]).toMatchObject({ id: targetProfessional.id, email: targetProfessional.email })

      expect(response.status).toBe(200)
      const { data } = response.body
      expect(Array.isArray(data)).toBe(true)
      expect(data).toHaveLength(1)
      expect(data[0]).toMatchObject({ id: targetProfessional.id, email: targetProfessional.email })
    })

    it('should return a list of professionals when name filter is set', async () => {
      // arrange
      const targetProfessional = await ProfessionalFactory.makeProfessional()
      const newName = 'Updated name'
      const spies = spyProfessionalsWiring()
      await ProfessionalFactory.makeProfessional()

      await request(app).put(`/api/professionals/${targetProfessional.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ name: newName })

      // act
      const response = await request(app)
        .get('/api/professionals')
        .set('Authorization', `Bearer ${token}`)
        .query({ name: 'Updated name' })

      // assert
      expect(response.status).toBe(200)
      expect(response.body.data).toHaveLength(1)
      expect(response.body.data[0]).toMatchObject({ id: targetProfessional.id, name: newName })

      expect(response.status).toBe(200)
      const { data } = response.body
      expect(Array.isArray(data)).toBe(true)
      expect(data).toHaveLength(1)
      expect(data[0]).toMatchObject({ id: targetProfessional.id, email: targetProfessional.email })
      expect(spies.usecase.executeFindAllPaginated).toHaveBeenCalledTimes(1)
      expect(spies.repository.findAllPaginated).toHaveBeenCalledTimes(1)
    })
  })

  describe('[GET] /api/professionals/:id', () => {
    it('should return an professional by id', async () => {
      // arrange
      const { id } = await ProfessionalFactory.makeProfessional()

      const spies = spyProfessionalsWiring()

      // act
      const response = await request(app)
        .get(`/api/professionals/${id}`)
        .set('Authorization', `Bearer ${token}`)

      // assert
      expect(response.status).toBe(200)
      expect(spies.repository.findById).toHaveBeenCalledTimes(1)
      expect(spies.usecase.executeFindById).toHaveBeenCalledTimes(1)
    })
  })

  describe('[POST] /api/professionals', () => {
    it('should create an professional', async () => {
      // arrange
      const spies = spyProfessionalsWiring()
      const email = faker.internet.email()

      // act
      const createdProfessionalResponse = await request(app)
        .post('/api/professionals')
        .set('Authorization', `Bearer ${token}`)
        .send({
          email
        })

      // assert
      expect(createdProfessionalResponse.status).toBe(201)
      const createdProfessional = createdProfessionalResponse.body
      expect(createdProfessional).toHaveProperty('id')

      expect(spies.usecase.executeCreate).toHaveBeenCalledTimes(1)
      expect(spies.usecase.executeCreate).toHaveBeenCalledWith(expect.objectContaining({ email }))
      expect(spies.repository.create).toHaveBeenCalledTimes(1)
      expect(spies.repository.create).toHaveBeenCalledWith(expect.objectContaining({ email }))
      expect(spies.repository.findByEmail).toHaveBeenCalledTimes(1)
      expect(spies.repository.findByEmail).toHaveBeenCalledWith(email)
    })

    it('should create an professional and throw a bad request when attempting to create an professional with an email that is already in use', async () => {
      // arrange
      const spies = spyProfessionalsWiring()
      const email = faker.internet.email()

      // act
      const createdProfessionalResponse = await request(app)
        .post('/api/professionals')
        .set('Authorization', `Bearer ${token}`)
        .send({
          email
        })

      const duplicatedProfessionalResponse = await request(app)
        .post('/api/professionals')
        .set('Authorization', `Bearer ${token}`)
        .send({
          email
        })

      // assert
      expect(createdProfessionalResponse.status).toBe(201)
      expect(duplicatedProfessionalResponse.status).toBe(400)
      expect(spies.usecase.executeCreate).toHaveBeenCalledTimes(2)
      expect(spies.usecase.executeCreate).toHaveBeenCalledWith(expect.objectContaining({ email }))
      expect(spies.repository.create).toHaveBeenCalledTimes(1)
      expect(spies.repository.create).toHaveBeenCalledWith(expect.objectContaining({ email }))
      expect(spies.repository.findByEmail).toHaveBeenCalledTimes(2)
      expect(duplicatedProfessionalResponse.body).toMatchObject({
        statusCode: 400,
        details: expect.stringMatching(/already exists/i)
      })
    })
  })

  describe('[PUT] /api/professionals/:id', () => {
    it('should update an professional', async () => {
      // arrange
      const { id } = await ProfessionalFactory.makeProfessional()

      const updatedEmail = faker.internet.email()
      const updatedName = faker.person.fullName()

      const spies = spyProfessionalsWiring()

      // act
      const response = await request(app)
        .put(`/api/professionals/${id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ email: updatedEmail, name: updatedName })

      // assert
      expect(response.status).toBe(200)
      expect(response.body).toMatchObject({ id, email: updatedEmail, name: updatedName })
      expect(spies.repository.update).toHaveBeenCalledTimes(1)
      expect(spies.repository.update).toHaveBeenCalledWith(id, expect.objectContaining({ email: updatedEmail, name: updatedName }))
      expect(spies.usecase.executeUpdate).toHaveBeenCalledTimes(1)
      expect(spies.usecase.executeUpdate).toHaveBeenCalledWith(id, expect.objectContaining({ email: updatedEmail, name: updatedName }))
    })
  })

  describe('[DELETE] /api/professionals/:id', () => {
    it('should create and delete an professional', async () => {
      // arrange
      const { id } = await ProfessionalFactory.makeProfessional()

      const spies = spyProfessionalsWiring()

      // act
      const response = await request(app)
        .delete(`/api/professionals/${id}`)
        .set('Authorization', `Bearer ${token}`)
        .send()

      // assert
      expect(response.status).toBe(200)
      expect(spies.repository.delete).toHaveBeenCalledTimes(1)
      expect(spies.usecase.executeDelete).toHaveBeenCalledTimes(1)
    })
  })
})
