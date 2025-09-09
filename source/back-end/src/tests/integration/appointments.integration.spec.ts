import request from 'supertest'
import { OfferFactory } from './factories/offer.factory'
import { app } from '@/app'
import { getCustomerToken, getProfessionalToken } from './utils/auth'
import { AppointmentsFactory } from './factories/appointment.factory'
import { type Customer, type Appointment, $Enums, type Professional } from '@prisma/client'
import { prismaClient } from '@/lib/prisma'
import { CustomerFactory } from './factories/customer.factory'
import { ProfessionalFactory } from './factories/professional.factory'

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
  })

  describe('[GET] /api/appointments', () => {
    it('should return a list with all appointments', async () => {
      const offer = await OfferFactory.makeOffer()
      const appointments = await Promise.all([
        AppointmentsFactory.makeAppointments({ offer: { connect: { id: offer.id } }, customer: { connect: { id: customer.id } } }),
        AppointmentsFactory.makeAppointments({ offer: { connect: { id: offer.id } } })
      ])

      const response = await request(app)
        .get('/api/appointments')
        .set(defaultAuthorizationHeader)
        .query({ page: 1, limit: 10 })

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

    it('should return a empty list of appointments when there is no appointment created', async () => {
      const response = await request(app)
        .get('/api/appointments')
        .set(defaultAuthorizationHeader)
        .query({ page: 1, limit: 10 })

      expect(response.status).toBe(200)
      expect(response.body).toEqual({
        appointments: []
      })
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
  })

  describe('[POST] /api/appointments', () => {
    it('should create a new appointment', async () => {
      const ONE_HOUR_IN_MILLISECONDS = 60 * 60 * 1000
      const offer = await OfferFactory.makeOffer()
      const appointmentDate = new Date()
      appointmentDate.setHours(appointmentDate.getHours() + ONE_HOUR_IN_MILLISECONDS)
      const appointment: Partial<Appointment> = {
        appointmentDate,
        customerId: customer.id,
        serviceOfferedId: offer.id
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
          appointmentDate: appointmentDate.toISOString()
        })
      )

      const appointmentOnDatabase = prismaClient.appointment.findUnique({
        where: { id: response.body.id }
      })

      expect(appointmentOnDatabase).toBeTruthy()
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
  })
})
