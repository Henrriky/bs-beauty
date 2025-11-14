import request from 'supertest'
import { OfferFactory } from './factories/offer.factory'
import { app } from '@/app'
import { getCustomerToken, getProfessionalToken } from './utils/auth'
import { AppointmentsFactory } from './factories/appointment.factory'
import { type Customer, type Appointment, $Enums, type Professional } from '@prisma/client'
import { prismaClient } from '@/lib/prisma'
import { CustomerFactory } from './factories/customer.factory'
import { ProfessionalFactory } from './factories/professional.factory'
import { MAXIMUM_APPOINTMENTS_PER_DAY, MINIMUM_SCHEDULLING_TIME_MINUTES } from '@/services/appointments.use-case'

describe('Appointments API (Integration Test)', () => {
  let customer: Customer
  let defaultAuthorizationHeader = {}

  beforeEach(async () => {
    vi.restoreAllMocks()

    const customerAuth = await getCustomerToken()
    customer = customerAuth.customer
    defaultAuthorizationHeader = {
      Authorization: `Bearer ${customerAuth.token}`
    }
  })

  describe('[GET] /api/appointments/offer/:serviceOfferedId', () => {
    it('should return a list with all appointments of a specific service offered', async () => {
      const professional = await ProfessionalFactory.makeProfessional()
      const offer = await OfferFactory.makeOffer({ professional: { connect: { id: professional.id } } })

      const appointments = await Promise.all([
        AppointmentsFactory.makeAppointments({ offer: { connect: { id: offer.id } }, customer: { connect: { id: customer.id } } }),
        AppointmentsFactory.makeAppointments({ offer: { connect: { id: offer.id } }, customer: { connect: { id: customer.id } } })
      ])

      const response = await request(app)
        .get(`/api/appointments/offer/${offer.id}`)
        .set(defaultAuthorizationHeader)

      expect(response.status).toBe(200)
      expect(response.body).toBeDefined()
      expect(response.body).toEqual({
        appointments: expect.arrayContaining(
          appointments.map(
            (appointment) =>
              expect.objectContaining(
                {
                  id: appointment.id,
                  customerId: appointment.customerId,
                  appointmentDate: appointment.appointmentDate.toISOString()
                }
              ))
        )
      })
      expect(response.body.appointments).toHaveLength(appointments.length)
    })

    it('should return a empty list when the service offered has no appointments', async () => {
      const offer = await OfferFactory.makeOffer()
      await Promise.all([
        AppointmentsFactory.makeAppointments({ customer: { connect: { id: customer.id } } }),
        AppointmentsFactory.makeAppointments({ customer: { connect: { id: customer.id } } })
      ])

      const response = await request(app)
        .get(`/api/appointments/offer/${offer.id}`)
        .set(defaultAuthorizationHeader)

      expect(response.status).toBe(200)
      expect(response.body).toEqual({
        appointments: []
      })
    })

    it('should return 401 if the user is not authenticated', async () => {
      const response = await request(app)
        .get('/api/appointments/offer/non-existant-id')
        .send()

      expect(response.status).toBe(401)
    })
  })

  describe('[GET] /api/appointments', () => {
    it('should return a list with all appointments', async () => {
      const offer = await OfferFactory.makeOffer()
      const appointment = await AppointmentsFactory.makeAppointments({
        offer: { connect: { id: offer.id } },
        customer: { connect: { id: customer.id } }
      })

      const response = await request(app)
        .get('/api/appointments')
        .set(defaultAuthorizationHeader)
        .query({ page: 1, limit: 10 })

      expect(response.status).toBe(200)
      expect(response.body).toBeDefined()
      expect(response.body.data).toBeDefined()
      expect(response.body.data).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: appointment.id,
            customerId: appointment.customerId,
            appointmentDate: appointment.appointmentDate.toISOString()
          })
        ])
      )
      expect(response.body.data).toHaveLength(1)
      expect(response.body).toHaveProperty('total')
      expect(response.body).toHaveProperty('page')
      expect(response.body).toHaveProperty('limit')
      expect(response.body).toHaveProperty('totalPages')
    })

    it('should return a empty list of appointments when there is no appointment created', async () => {
      const response = await request(app)
        .get('/api/appointments')
        .set(defaultAuthorizationHeader)
        .query({ page: 1, limit: 10 })

      expect(response.status).toBe(200)
      expect(response.body).toEqual({
        data: [],
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 0
      })
    })

    it('should return 401 if the user is not authenticated', async () => {
      const response = await request(app)
        .get('/api/appointments')
        .send()

      expect(response.status).toBe(401)
    })
  })

  describe('[GET] /api/appointments/customer', () => {
    describe('Customer authenticated user', () => {
      it('should return a list with all appointments of the authenticated customer', async () => {
        const appointments = await Promise.all([
          AppointmentsFactory.makeAppointments({ customer: { connect: { id: customer.id } } }),
          AppointmentsFactory.makeAppointments({ customer: { connect: { id: customer.id } } })
        ])

        const response = await request(app)
          .get('/api/appointments/customer')
          .set(defaultAuthorizationHeader)

        expect(response.status).toBe(200)
        expect(response.body).toBeDefined()
        expect(response.body).toEqual({
          appointments: expect.arrayContaining(
            appointments.map(
              (appointment) =>
                expect.objectContaining(
                  {
                    id: appointment.id,
                    customerId: appointment.customerId,
                    appointmentDate: appointment.appointmentDate.toISOString()
                  }
                ))
          )
        })
        expect(response.body.appointments).toHaveLength(appointments.length)
      })
    })

    describe('Professional authenticated user', () => {
      let professional: Professional

      beforeEach(async () => {
        const professionalAuth = await getProfessionalToken($Enums.UserType.PROFESSIONAL)
        professional = professionalAuth.professional
        defaultAuthorizationHeader = {
          Authorization: `Bearer ${professionalAuth.token}`
        }
      })

      it('should return a list with all appointments of the authenticated professional when he has appointments', async () => {
        const offer = await OfferFactory.makeOffer({ professional: { connect: { id: professional.id } } })
        const appointments = await Promise.all([
          AppointmentsFactory.makeAppointments({ offer: { connect: { id: offer.id } } })
        ])

        const response = await request(app)
          .get('/api/appointments/customer')
          .set(defaultAuthorizationHeader)

        expect(response.status).toBe(200)
        expect(response.body).toBeDefined()
        expect(response.body).toEqual({
          appointments: expect.arrayContaining(
            appointments.map(
              (appointment) =>
                expect.objectContaining(
                  {
                    id: appointment.id,
                    customerId: appointment.customerId,
                    appointmentDate: appointment.appointmentDate.toISOString()
                  }
                ))
          )
        })
        expect(response.body.appointments).toHaveLength(appointments.length)
      })

      it('should return a empty list when the authenticated professional has no appointments', async () => {
        const response = await request(app)
          .get('/api/appointments/customer')
          .set(defaultAuthorizationHeader)

        expect(response.status).toBe(200)
        expect(response.body).toEqual({
          appointments: []
        })
      })
    })

    it('should return 401 if the user is not authenticated', async () => {
      const response = await request(app)
        .get('/api/appointments/customer')
        .send()

      expect(response.status).toBe(401)
    })
  })

  describe('[GET] /api/appointments/:id', () => {
    it('should return a appointment by id', async () => {
      const offer = await OfferFactory.makeOffer()
      const appointment = await AppointmentsFactory.makeAppointments({ offer: { connect: { id: offer.id } }, customer: { connect: { id: customer.id } } })

      const response = await request(app)
        .get(`/api/appointments/${appointment.id}`)
        .set(defaultAuthorizationHeader)

      expect(response.status).toBe(200)
      expect(response.body).toEqual(
        expect.objectContaining({
          id: appointment.id,
          serviceOfferedId: appointment.serviceOfferedId,
          appointmentDate: appointment.appointmentDate.toISOString()
        })
      )
    })

    it('should return 404 if appointment does not exist', async () => {
      const response = await request(app)
        .get('/api/appointments/not-existant-id')
        .set(defaultAuthorizationHeader)

      expect(response.status).toBe(404)
      expect(response.body).toEqual(
        expect.objectContaining({
          statusCode: 404,
          message: expect.any(String)
        })
      )
    })

    it('should return 401 if the user is not authenticated', async () => {
      const response = await request(app)
        .get('/api/appointments/non-existant-id')
        .send()

      expect(response.status).toBe(401)
    })
  })

  describe('[POST] /api/appointments', () => {
    it('should create a valid appointment', async () => {
      const ONE_HOUR_IN_MILLISECONDS = 60 * 60 * 1000
      const offer = await OfferFactory.makeOffer()
      const appointmentDate = new Date()
      appointmentDate.setHours(appointmentDate.getHours() + ONE_HOUR_IN_MILLISECONDS)
      const appointment: Partial<Appointment> = {
        appointmentDate,
        customerId: customer.id,
        serviceOfferedId: offer.id,
        allowImageUse: true
      }

      const response = await request(app)
        .post('/api/appointments')
        .send(appointment)
        .set(defaultAuthorizationHeader)

      expect(response.status).toBe(201)
      expect(response.body).toEqual(
        expect.objectContaining({
          id: expect.any(String),
          serviceOfferedId: appointment.serviceOfferedId,
          appointmentDate: appointmentDate.toISOString(),
          allowImageUse: expect.any(Boolean)
        })
      )

      const appointmentOnDatabase = prismaClient.appointment.findUnique({
        where: { id: response.body.id }
      })

      expect(appointmentOnDatabase).toBeTruthy()
    })

    it('should return 400 if trying to create an appointment with invalid date', async () => {
      const offer = await OfferFactory.makeOffer()
      const appointment: Partial<Appointment> = {
        appointmentDate: new Date('invalid-date'),
        customerId: customer.id,
        serviceOfferedId: offer.id,
        allowImageUse: true
      }

      const response = await request(app)
        .post('/api/appointments')
        .set(defaultAuthorizationHeader)
        .send(appointment)

      expect(response.status).toBe(400)
      expect(response.body.message).toContain('Validation Error')
    })

    it(`should return 409 if trying to create an appointment with less than ${MINIMUM_SCHEDULLING_TIME_MINUTES} minutes in advance`, async () => {
      const offer = await OfferFactory.makeOffer()
      const HALF_MINIMUM_SCHEDULING_MS = (MINIMUM_SCHEDULLING_TIME_MINUTES / 2) * 60 * 1000
      const appointmentDateTooSoon = new Date(Date.now() + HALF_MINIMUM_SCHEDULING_MS)
      const appointment: Partial<Appointment> = {
        appointmentDate: appointmentDateTooSoon,
        customerId: customer.id,
        serviceOfferedId: offer.id,
        allowImageUse: true
      }
      const response = await request(app)
        .post('/api/appointments')
        .set(defaultAuthorizationHeader)
        .send(appointment)

      expect(response.status).toBe(409)
      expect(response.body.message).toBe(
        `The selected time must be at least ${MINIMUM_SCHEDULLING_TIME_MINUTES} minutes in the future.`
      )
    })

    it('should return 409 if trying to create appointment in the past', async () => {
      const offer = await OfferFactory.makeOffer()
      const appointmentDateInPast = new Date(Date.now() - 60 * 60 * 1000) // 1 hour ago
      const appointment: Partial<Appointment> = {
        appointmentDate: appointmentDateInPast,
        customerId: customer.id,
        serviceOfferedId: offer.id,
        allowImageUse: true
      }

      const response = await request(app)
        .post('/api/appointments')
        .set(defaultAuthorizationHeader)
        .send(appointment)

      expect(response.status).toBe(409)
      expect(response.body.message).toBe('The selected time is in the past.')
    })

    it(`should return 409 if trying to create more than ${MAXIMUM_APPOINTMENTS_PER_DAY} appointments per day`, async () => {
      const offer = await OfferFactory.makeOffer()

      for await (const i of Array.from({ length: MAXIMUM_APPOINTMENTS_PER_DAY }, (_, i) => i + 1)) {
        const appointmentDate = new Date(Date.now() + 60 * 60 * (1000 * i + 1))
        const appointment: Partial<Appointment> = {
          appointmentDate,
          customerId: customer.id,
          serviceOfferedId: offer.id,
          allowImageUse: true
        }

        await request(app)
          .post('/api/appointments')
          .set(defaultAuthorizationHeader)
          .send(appointment)
      }

      const appointmentDate = new Date(Date.now() + 60 * 60 * (1000 * (MAXIMUM_APPOINTMENTS_PER_DAY + 1)))
      const appointment: Partial<Appointment> = {
        appointmentDate,
        customerId: customer.id,
        serviceOfferedId: offer.id,
        allowImageUse: true
      }

      // Try to create one more appointment on same day
      const response = await request(app)
        .post('/api/appointments')
        .set(defaultAuthorizationHeader)
        .send(appointment)

      expect(response.status).toBe(409)
      expect(response.body.message).toBe(
        'You have reached the maximum number of appointments for today, please try again tomorrow.'
      )
    })

    it('should return 401 if the user is not authenticated', async () => {
      const response = await request(app)
        .post('/api/appointments')
        .send()

      expect(response.status).toBe(401)
    })
  })

  describe('[PUT] /api/appointments/:id', () => {
    it('should update an existing appointment', async () => {
      const appointment = await AppointmentsFactory.makeAppointments({
        customer: { connect: { id: customer.id } }
      })

      const observationToUpdate = 'New observation'
      const response = await request(app)
        .put(`/api/appointments/${appointment.id}`)
        .set(defaultAuthorizationHeader)
        .send({
          observation: observationToUpdate
        })

      expect(response.status).toBe(200)
      expect(response.body).toEqual(
        expect.objectContaining({
          id: appointment.id,
          observation: observationToUpdate
        })
      )
    })

    it('should return 404 if trying to update a non existent appointment', async () => {
      const response = await request(app)
        .put('/api/appointments/not-existant-id')
        .set(defaultAuthorizationHeader)
        .send({
          appointmentDate: new Date()
        })

      expect(response.status).toBe(404)
      expect(response.body).toEqual(
        expect.objectContaining({
          statusCode: 404,
          message: expect.any(String)
        })
      )
    })

    it('should return 403 if trying to update an appointment that does not belong to the authenticated customer', async () => {
      const anotherCustomer = await CustomerFactory.makeCustomer()

      const appointment = await AppointmentsFactory.makeAppointments({ customer: { connect: { id: anotherCustomer.id } } })

      const response = await request(app)
        .put(`/api/appointments/${appointment.id}`)
        .set(defaultAuthorizationHeader)
        .send({
          appointmentDate: new Date()
        })

      expect(response.status).toBe(403)
      expect(response.body).toEqual(
        expect.objectContaining({
          statusCode: 403,
          message: expect.any(String)
        })
      )
    })

    it('should return 401 if the user is not authenticated', async () => {
      const response = await request(app)
        .put('/api/appointments/non-existant-id')
        .send()

      expect(response.status).toBe(401)
    })
  })

  describe('[DELETE] /api/appointments/:id', () => {
    it('should delete an existing appointment', async () => {
      const appointment = await AppointmentsFactory.makeAppointments({
        customer: { connect: { id: customer.id } }
      })

      const response = await request(app)
        .delete(`/api/appointments/${appointment.id}`)
        .set(defaultAuthorizationHeader)

      expect(response.status).toBe(200)
      expect(response.body).toEqual(
        expect.objectContaining({
          id: appointment.id,
          observation: appointment.observation,
          appointmentDate: appointment.appointmentDate.toISOString()
        })
      )

      const appointmentOnDatabase = await prismaClient.appointment.findUnique({
        where: { id: appointment.id }
      })

      expect(appointmentOnDatabase).toBeNull()
    })

    it('should return 404 if trying to delete a non existent appointment', async () => {
      const response = await request(app)
        .delete('/api/appointments/not-existant-id')
        .set(defaultAuthorizationHeader)

      expect(response.status).toBe(404)
      expect(response.body).toEqual(
        expect.objectContaining({
          statusCode: 404,
          message: expect.any(String)
        })
      )
    })

    it('should return 403 if trying to update an appointment that does not belong to the authenticated customer', async () => {
      const anotherCustomer = await CustomerFactory.makeCustomer()

      const appointment = await AppointmentsFactory.makeAppointments({ customer: { connect: { id: anotherCustomer.id } } })

      const response = await request(app)
        .delete(`/api/appointments/${appointment.id}`)
        .set(defaultAuthorizationHeader)

      expect(response.status).toBe(403)
      expect(response.body).toEqual(
        expect.objectContaining({
          statusCode: 403,
          message: expect.any(String)
        })
      )
    })

    it('should return 401 if the user is not authenticated', async () => {
      const response = await request(app)
        .delete('/api/appointments/non-existant-id')
        .send()

      expect(response.status).toBe(401)
    })
  })
})
