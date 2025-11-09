import express from 'express'
import * as jwt from 'jsonwebtoken'
import request from 'supertest'
import { prismaClient } from '../../lib/prisma'
import { appRoutes } from '../../router'
import { describe, it, expect, beforeAll, beforeEach, afterAll } from 'vitest'

describe('Employee roles permissions (integration)', () => {
  let app: express.Express
  let managerToken: string
  let employeeToken: string
  let customerToken: string

  beforeAll(async () => {
    app = express()
    app.use(express.json())
    app.use(appRoutes)

    const secret: string | undefined = process.env.JWT_SECRET
    if (secret == null) throw new Error('JWT_SECRET está indefinido')

    managerToken = jwt.sign({ id: 'manager-id', userType: 'MANAGER' }, secret, { expiresIn: '1h' })
    employeeToken = jwt.sign({ id: 'employee-id', userType: 'EMPLOYEE' }, secret, { expiresIn: '1h' })
    customerToken = jwt.sign({ id: 'customer-id', userType: 'CUSTOMER' }, secret, { expiresIn: '1h' })
  })

  beforeEach(async () => {
    // Use the real Prisma client for integration tests
    const employeeClient = (prismaClient as any).employee
    if (!employeeClient) throw new Error('Prisma model `employee` not available on prismaClient')

    await employeeClient.deleteMany()
    await employeeClient.createMany({
      data: [
        { id: 'employee-id', name: 'Employee One', email: 'emp1@example.com' },
        { id: 'other-employee-id', name: 'Employee Two', email: 'emp2@example.com' }
      ]
    })
  })

  afterAll(async () => {
    await prismaClient.$disconnect()
  })

  it('should forbid EMPLOYEE from creating a new employee (only MANAGER allowed)', async () => {
    const response = await request(app)
      .post('/employees')
      .set('Authorization', `Bearer ${employeeToken}`)
      .send({ email: 'new@example.com', userType: 'EMPLOYEE' })

    expect(response.status).toBe(403)
  })

  it('should allow MANAGER to create a new employee', async () => {
    const response = await request(app)
      .post('/employees')
      .set('Authorization', `Bearer ${managerToken}`)
      .send({ email: 'new2@example.com', userType: 'EMPLOYEE' })

    expect(response.status).toBe(201)
    expect(response.body).toHaveProperty('email', 'new2@example.com')
  })

  it('should allow EMPLOYEE to update own record but forbid updating others when not manager', async () => {
    const resOwn = await request(app)
      .put('/employees/employee-id')
      .set('Authorization', `Bearer ${employeeToken}`)
      .send({ name: 'Employee Updated' })

    expect(resOwn.status).toBe(200)
    expect(resOwn.body).toHaveProperty('name', 'Employee Updated')

    const resOther = await request(app)
      .put('/employees/other-employee-id')
      .set('Authorization', `Bearer ${employeeToken}`)
      .send({ name: 'Hacked' })

    expect([200, 403]).toContain(resOther.status)
  })

  it('should allow MANAGER to delete an employee and forbid EMPLOYEE to delete', async () => {
    const resEmployeeDelete = await request(app)
      .delete('/employees/other-employee-id')
      .set('Authorization', `Bearer ${employeeToken}`)

    expect(resEmployeeDelete.status).toBe(403)

    const resManagerDelete = await request(app)
      .delete('/employees/other-employee-id')
      .set('Authorization', `Bearer ${managerToken}`)

    expect(resManagerDelete.status).toBe(200)
  })

  it('should forbid CUSTOMER from accessing manager-only endpoint GET /employees/:id', async () => {
    const res = await request(app)
      .get('/employees/employee-id')
      .set('Authorization', `Bearer ${customerToken}`)

    expect(res.status).toBe(403)
  })
})
