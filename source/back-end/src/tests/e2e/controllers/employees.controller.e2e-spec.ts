import express from 'express'
import * as jwt from 'jsonwebtoken'
import request from 'supertest'
import { prismaClient } from '../../../lib/prisma'
import { appRoutes } from '../../../router'
import { type Prisma } from '@prisma/client'

describe('EmployeesController', () => {
  let app: express.Express
  let validToken: string

  beforeEach(async () => {
    await prismaClient.employee.deleteMany()
    await prismaClient.employee.createMany({
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
    it('should return a list of employees', async () => {
      // act
      const response = await request(app)
        .get('/employees')
        .set('Authorization', `Bearer ${validToken}`)

      // assert
      expect(response.status).toBe(200)
      expect(response.body.employees).toHaveLength(2)
      expect(response.body.employees[0]).toHaveProperty('name', 'John Doe')
    })
  })

  describe('handleFindById', () => {
    it('should return an employee by id', async () => {
      // act
      const response = await request(app)
        .get('/employees/random-uuid')
        .set('Authorization', `Bearer ${validToken}`)

      // assert
      expect(response.status).toBe(200)
      expect(response.body).toHaveProperty('name', 'John Doe')
    })
  })

  describe('handleCreate', () => {
    it('should create a new employee and store in the database', async () => {
      const newEmployee: Prisma.EmployeeCreateInput = {
        email: 'mark@example.com',
        userType: 'EMPLOYEE'
      }

      const response = await request(app)
        .post('/employees')
        .set('Authorization', `Bearer ${validToken}`)
        .send(newEmployee)

      const employeeQuantity = await prismaClient.employee.count()

      // assert
      expect(response.status).toBe(201)
      expect(response.body).toHaveProperty('name', 'Usuário')
      expect(response.body).toHaveProperty('email', 'mark@example.com')
      expect(response.body).toHaveProperty('userType', 'EMPLOYEE')
      expect(employeeQuantity).toBe(3)
    })
  })

  describe('handleUpdate', () => {
    it('should update an employee and save changes in the database', async () => {
      // act
      const response = await request(app)
        .put('/employees/random-uuid')
        .set('Authorization', `Bearer ${validToken}`)
        .send({ name: 'John Updated' })

      // assert
      expect(response.status).toBe(200)
      expect(response.body).toHaveProperty('name', 'John Updated')
    })
  })

  describe('handleDelete', () => {
    it('should delete an employee from the database', async () => {
      // act
      const response = await request(app)
        .delete('/employees/random-uuid')
        .set('Authorization', `Bearer ${validToken}`)

      const employeeQuantity = await prismaClient.employee.count()
      // assert
      expect(response.status).toBe(200)
      expect(employeeQuantity).toBe(1)
    })
  })
})
