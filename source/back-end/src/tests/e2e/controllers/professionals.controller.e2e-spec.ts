import express from 'express'
import * as jwt from 'jsonwebtoken'
import request from 'supertest'
import { prismaClient } from '../../../lib/prisma'
import { appRoutes } from '../../../router'
import { type Prisma } from '@prisma/client'

describe('ProfessionalsController', () => {
  let app: express.Express
  let validToken: string

  beforeEach(async () => {
    await prismaClient.professional.deleteMany()
    await prismaClient.professional.createMany({
      data: [
        { id: 'random-uuid', name: 'John Doe', email: 'john@example.com' },
        { id: 'random-uuid2', name: 'Jane Doe', email: 'jane@example.com' }
      ]
    })
  })

  beforeAll(async () => {
    app = express()
    app.use(express.json())
    app.use(appRoutes)

    const secret: string | undefined = process.env.JWT_SECRET

    if (secret == null) {
      throw new Error('JWT_SECRET está indefinido')
    }

    validToken = jwt.sign(
      { id: '12345', userType: 'MANAGER' },
      secret,
      { expiresIn: '1h' }
    )
  })

  afterAll(async () => {
    await prismaClient.$disconnect()
  })

  describe('handleFindAll', () => {
    it('should return a list of professionals', async () => {
      // act
      const response = await request(app)
        .get('/professionals')
        .set('Authorization', `Bearer ${validToken}`)

      // assert
      expect(response.status).toBe(200)
      expect(response.body.professionals).toHaveLength(2)
      expect(response.body.professionals[0]).toHaveProperty('name', 'John Doe')
    })
  })

  describe('handleFindById', () => {
    it('should return an professional by id', async () => {
      // act
      const response = await request(app)
        .get('/professionals/random-uuid')
        .set('Authorization', `Bearer ${validToken}`)

      // assert
      expect(response.status).toBe(200)
      expect(response.body).toHaveProperty('name', 'John Doe')
    })
  })

  describe('handleCreate', () => {
    it('should create a new professional and store in the database', async () => {
      const newProfessional: Prisma.ProfessionalCreateInput = {
        email: 'mark@example.com',
        userType: 'PROFESSIONAL'
      }

      const response = await request(app)
        .post('/professionals')
        .set('Authorization', `Bearer ${validToken}`)
        .send(newProfessional)

      const professionalQuantity = await prismaClient.professional.count()

      // assert
      expect(response.status).toBe(201)
      expect(response.body).toHaveProperty('name', 'Usuário')
      expect(response.body).toHaveProperty('email', 'mark@example.com')
      expect(response.body).toHaveProperty('userType', 'PROFESSIONAL')
      expect(professionalQuantity).toBe(3)
    })
  })

  describe('handleUpdate', () => {
    it('should update an professional and save changes in the database', async () => {
      // act
      const response = await request(app)
        .put('/professionals/random-uuid')
        .set('Authorization', `Bearer ${validToken}`)
        .send({ name: 'John Updated' })

      // assert
      expect(response.status).toBe(200)
      expect(response.body).toHaveProperty('name', 'John Updated')
    })
  })

  describe('handleDelete', () => {
    it('should delete an professional from the database', async () => {
      // act
      const response = await request(app)
        .delete('/professionals/random-uuid')
        .set('Authorization', `Bearer ${validToken}`)

      const professionalQuantity = await prismaClient.professional.count()
      // assert
      expect(response.status).toBe(200)
      expect(professionalQuantity).toBe(1)
    })
  })
})
