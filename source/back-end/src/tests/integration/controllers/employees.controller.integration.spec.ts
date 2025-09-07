import { type Professional } from '@prisma/client'
import request from 'supertest'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { app } from '../../../app'
import { getManagerToken } from '../utils/auth'
import { spyProfessionalsWiring } from '../utils/professionals-spies'
import { faker } from '@faker-js/faker'

describe('ProfessionalsController', () => {
  let token: string

  beforeEach(async () => {
    vi.restoreAllMocks()
    token = getManagerToken()
  })

  describe('handleFindAll - [GET /api/professionals]', () => {
    it('should return a list of professionals', async () => {
      // arrange
      const professional1 = await createProfessional()
      const professional2 = await createProfessional()

      const spies = spyProfessionalsWiring()

      // act
      const response = await request(app)
        .get('/api/professionals')
        .set('Authorization', `Bearer ${token}`)
        .query({ page: 1, limit: 10 })

      const { data } = response.body

      // assert
      expect(response.status).toBe(200)
      expect(response.body.data).toHaveLength(2)
      expect(data.map((e: Professional) => e.email)).toEqual(
        expect.arrayContaining([professional1.email, professional2.email])
      )

      expect(spies.usecase.executeFindAllPaginated).toHaveBeenCalledTimes(1)
      expect(spies.repository.findAllPaginated).toHaveBeenCalledTimes(1)
    })

    it('should return a list of professionals when email filter is set', async () => {
      // arrange
      const targetProfessional = await createProfessional()
      await createProfessional()

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
      const targetProfessional = await createProfessional()
      const newName = 'Updated name'
      const spies = spyProfessionalsWiring()
      await createProfessional()

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

  describe('handleFindById', () => {
    it('should return an professional by id', async () => {
      // arrange
      const { id } = await createProfessional()

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

  describe('handleCreate', () => {
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

  describe('handleUpdate', () => {
    it('should update an professional', async () => {
      // arrange
      const { id } = await createProfessional()

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

  describe('handleDelete', () => {
    it('should create and delete an professional', async () => {
      // arrange
      const { id } = await createProfessional()

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

  async function createProfessional() {
    const email = faker.internet.email()

    const createResponse = await request(app)
      .post('/api/professionals')
      .set('Authorization', `Bearer ${token}`)
      .send({ email })

    expect(createResponse.status).toBe(201)
    const created = createResponse.body as Professional
    expect(created).toHaveProperty('id')

    return {
      ...created
    } satisfies Professional
  }
})
