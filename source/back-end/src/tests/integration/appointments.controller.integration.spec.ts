import { type Express } from 'express'
import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest'
// mock the appointment zod schemas module to avoid loading a broken schema implementation in tests
vi.mock('../../utils/validation/zod-schemas/appointment.zod-schemas.validation.utils', () => {
  const zodLike = () => ({ parse: (v: any) => v })
  return {
    AppointmentSchemas: {
      createBasicSchema: { extend: () => zodLike() },
      createSchema: zodLike(),
      customerUpdateSchema: zodLike(),
      professionalUpdateSchema: zodLike()
    }
  }
})
import { app } from '../../app'
import { faker } from '@faker-js/faker'
import { Status, type Appointment } from '@prisma/client'
import { AppointmentsFactory } from './factories/appointment.factory'
import { CustomerFactory } from './factories/customer.factory'
import { OfferFactory } from './factories/offer.factory'
import { MAXIMUM_APPOINTMENTS_PER_DAY, MINIMUM_SCHEDULLING_TIME_MINUTES } from '../../services/appointments.use-case'
import { sign } from 'jsonwebtoken'
import { ENV } from '../../config/env'

describe('Appointments Controller (Integration Tests)', () => {
  let application: Express
  let authToken: string
  let customer: { id: string }

  beforeEach(async () => {
    application = app
    // criar um customer antes de cada teste (o truncate do setup remove registros entre testes)
    customer = await CustomerFactory.makeCustomer({
      registerCompleted: true,
      email: faker.internet.email(),
      name: faker.person.fullName(),
      profilePhotoUrl: faker.image.url()
    })
    const payload = {
      sub: customer.id,
      userId: customer.id,
      userType: 'CUSTOMER'
    }
    authToken = sign(payload, ENV.JWT_SECRET, { expiresIn: '1d' })
  })

  afterAll(async () => {
    // No need to close Express app
  })

  describe('POST /appointments', () => {
    it('should create a valid appointment', async () => {
      const offer = await OfferFactory.makeOffer()
      const appointmentDateInOneHour = new Date(Date.now() + 60 * 60 * 1000)

      const response = await request(application)
        .post('/api/appointments')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          appointmentDate: appointmentDateInOneHour.toISOString(),
          observation: faker.lorem.sentence(),
          customer: { connect: { id: customer.id } },
          offer: { connect: { id: offer.id } }
        })

      expect(response.status).toBe(201)
      expect(response.body).toHaveProperty('id')
      expect(response.body.customerId).toBe(customer.id)
      expect(response.body.serviceOfferedId).toBe(offer.id)
      expect(response.body.status).toBe(Status.PENDING)
    })

    it('should not create appointment with invalid date', async () => {
      const offer = await OfferFactory.makeOffer()

      const response = await request(application)
        .post('/api/appointments')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          appointmentDate: 'invalid-date',
          observation: faker.lorem.sentence(),
          customer: { connect: { id: customer.id } },
          offer: { connect: { id: offer.id } }
        })

      expect(response.status).toBe(409)
      expect(response.body.message).toContain('Invalid appointment date provided')
    })

    it('should not create appointment in the past', async () => {
      const offer = await OfferFactory.makeOffer()
      const appointmentDateInPast = new Date(Date.now() - 60 * 60 * 1000) // 1 hour ago

      const response = await request(application)
        .post('/api/appointments')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          appointmentDate: appointmentDateInPast.toISOString(),
          observation: faker.lorem.sentence(),
          customer: { connect: { id: customer.id } },
          offer: { connect: { id: offer.id } }
        })

      expect(response.status).toBe(409)
      expect(response.body.message).toBe('The selected time is in the past.')
    })

    it(`should not create appointment with less than ${MINIMUM_SCHEDULLING_TIME_MINUTES} minutes in advance`, async () => {
      const offer = await OfferFactory.makeOffer()
      const HALF_MINIMUM_SCHEDULING_MS = (MINIMUM_SCHEDULLING_TIME_MINUTES / 2) * 60 * 1000
      const appointmentDateTooSoon = new Date(Date.now() + HALF_MINIMUM_SCHEDULING_MS)

      const response = await request(application)
        .post('/api/appointments')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          appointmentDate: appointmentDateTooSoon.toISOString(),
          observation: faker.lorem.sentence(),
          customer: { connect: { id: customer.id } },
          offer: { connect: { id: offer.id } }
        })

      expect(response.status).toBe(409)
      expect(response.body.message).toBe(
        `The selected time must be at least ${MINIMUM_SCHEDULLING_TIME_MINUTES} minutes in the future.`
      )
    })

    it(`should not create more than ${MAXIMUM_APPOINTMENTS_PER_DAY} appointments per day`, async () => {
      const offer = await OfferFactory.makeOffer()
      const appointmentDate = new Date(Date.now() + 60 * 60 * 1000) // 1 hour from now

      // Create maximum allowed appointments for the day
      // Create maximum allowed appointments via API to ensure relation records exist
      for (let i = 0; i < MAXIMUM_APPOINTMENTS_PER_DAY; i++) {
        const apptDate = new Date(appointmentDate.getTime() + i * 60 * 60 * 1000) // different times same day
        await request(application)
          .post('/api/appointments')
          .set('Authorization', `Bearer ${authToken}`)
          .send({
            appointmentDate: apptDate.toISOString(),
            observation: faker.lorem.sentence(),
            customer: { connect: { id: customer.id } },
            offer: { connect: { id: offer.id } }
          })
      }

      // Try to create one more appointment on same day
      const response = await request(application)
        .post('/api/appointments')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          appointmentDate: appointmentDate.toISOString(),
          observation: faker.lorem.sentence(),
          customer: { connect: { id: customer.id } },
          offer: { connect: { id: offer.id } }
        })

      expect(response.status).toBe(409)
      expect(response.body.message).toBe(
        'You have reached the maximum number of appointments for today, please try again tomorrow.'
      )
    })

    it('should require authentication', async () => {
      const offer = await OfferFactory.makeOffer()
      const appointmentDateInOneHour = new Date(Date.now() + 60 * 60 * 1000)

      const response = await request(application)
        .post('/api/appointments')
        .send({
          appointmentDate: appointmentDateInOneHour.toISOString(),
          observation: faker.lorem.sentence(),
          customerId: customer.id,
          serviceOfferedId: offer.id
        })

      expect(response.status).toBe(401)
    })
  })
})
