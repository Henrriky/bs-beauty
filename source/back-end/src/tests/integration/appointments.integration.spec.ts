import request from 'supertest'
import { OfferFactory } from './factories/offer.factory'
import { app } from '@/app'
import { getCustomerToken, getProfessionalToken } from './utils/auth'
import { AppointmentsFactory } from './factories/appointment.factory'
import { type Customer, type Appointment, $Enums, type Professional } from '@prisma/client'
import { prismaClient } from '@/lib/prisma'
import { CustomerFactory } from './factories/customer.factory'
import { ProfessionalFactory } from './factories/professional.factory'
import { ServiceFactory } from './factories/service.factory'
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

    it('should return 401 if the user is not authenticated', async () => {
      const response = await request(app)
        .get('/api/appointments')
        .send()

      expect(response.status).toBe(401)
    })

    it('should filter appointments by service name', async () => {

      const targetService = await ServiceFactory.makeService({ 
        name: 'Corte de Cabelo',
        category: 'Cabelo' 
      })
      const otherService = await ServiceFactory.makeService({ 
        name: 'Manicure',
        category: 'Unhas' 
      })


      const targetOffer = await OfferFactory.makeOffer({ 
        service: { connect: { id: targetService.id } }
      })
      const otherOffer = await OfferFactory.makeOffer({ 
        service: { connect: { id: otherService.id } }
      })
      
      const matchingAppointments = await Promise.all([
        AppointmentsFactory.makeAppointments({ 
          offer: { connect: { id: targetOffer.id } },
          customer: { connect: { id: customer.id } }
        }),
        AppointmentsFactory.makeAppointments({ 
          offer: { connect: { id: targetOffer.id } },
          customer: { connect: { id: customer.id } }
        })
      ])

      await AppointmentsFactory.makeAppointments({ 
        offer: { connect: { id: otherOffer.id } },
        customer: { connect: { id: customer.id } }
      })

      const response = await request(app)
        .get('/api/appointments')
        .set(defaultAuthorizationHeader)
        .query({ page: 1, limit: 10, service: 'Corte de Cabelo' })

      expect(response.status).toBe(200)
      expect(response.body).toBeDefined()
      expect(response.body.appointments).toHaveLength(matchingAppointments.length)
      expect(response.body.appointments).toEqual(
        expect.arrayContaining(
          matchingAppointments.map(appointment =>
            expect.objectContaining({
              id: appointment.id,
              customerId: appointment.customerId,
              appointmentDate: appointment.appointmentDate.toISOString()
            })
          )
        )
      )
    })

    it('should return empty list when filtering by non-existent service', async () => {
      const service = await ServiceFactory.makeService({ 
        name: 'Corte de Cabelo',
        category: 'Cabelo' 
      })
      
      const offer = await OfferFactory.makeOffer({ 
        service: { connect: { id: service.id } }
      })
      

      await AppointmentsFactory.makeAppointments({ 
        offer: { connect: { id: offer.id } },
        customer: { connect: { id: customer.id } }
      })

      const response = await request(app)
        .get('/api/appointments')
        .set(defaultAuthorizationHeader)
        .query({ page: 1, limit: 10, service: 'Non Existent Service' })

      expect(response.status).toBe(200)
      expect(response.body).toBeDefined()
      expect(response.body.appointments).toHaveLength(0)
      expect(response.body.appointments).toEqual([])
    })

    it('should handle service name case insensitively', async () => {
      const service = await ServiceFactory.makeService({ 
        name: 'Corte de Cabelo',
        category: 'Cabelo' 
      })
      
      const offer = await OfferFactory.makeOffer({ 
        service: { connect: { id: service.id } }
      })

      const appointment = await AppointmentsFactory.makeAppointments({ 
        offer: { connect: { id: offer.id } },
        customer: { connect: { id: customer.id } }
      })

      const response = await request(app)
        .get('/api/appointments')
        .set(defaultAuthorizationHeader)
        .query({ page: 1, limit: 10, service: 'corte de cabelo' })

      expect(response.status).toBe(200)
      expect(response.body).toBeDefined()
      expect(response.body.appointments).toHaveLength(1)
      expect(response.body.appointments[0]).toEqual(
        expect.objectContaining({
          id: appointment.id,
          customerId: appointment.customerId,
          appointmentDate: appointment.appointmentDate.toISOString()
        })
      )
    })
  })

  describe('Customer Acquisition Tests', () => {
    it('should create appointments for referred customers and maintain referral relationship', async () => {
      const referrer = await CustomerFactory.makeCustomer()
      
      const referredCustomer = await CustomerFactory.makeCustomer({
        referrer: { connect: { id: referrer.id } }
      })
      
      const service = await ServiceFactory.makeService({ 
        name: 'Corte de Cabelo',
        category: 'Cabelo' 
      })
      
      const offer = await OfferFactory.makeOffer({ 
        service: { connect: { id: service.id } }
      })
      
      const appointment = await AppointmentsFactory.makeAppointments({ 
        offer: { connect: { id: offer.id } },
        customer: { connect: { id: referredCustomer.id } }
      })

      const { token: referredToken } = await getCustomerToken()
      
      const response = await request(app)
        .get('/api/appointments')
        .set({
          Authorization: `Bearer ${referredToken}`
        })
        .query({ page: 1, limit: 10 })

      expect(response.status).toBe(200)
      expect(response.body).toBeDefined()
      expect(response.body.appointments).toHaveLength(1)
      expect(response.body.appointments[0]).toEqual(
        expect.objectContaining({
          id: appointment.id,
          customerId: referredCustomer.id,
          appointmentDate: appointment.appointmentDate.toISOString()
        })
      )

      const referredCustomerFromDb = await prismaClient.customer.findUnique({
        where: { id: referredCustomer.id },
        include: { referrer: true }
      })
      
      expect(referredCustomerFromDb?.referrer).toBeDefined()
      expect(referredCustomerFromDb?.referrer?.id).toBe(referrer.id)
    })

    it('should track appointments from direct customers and verify no referral relationship', async () => {
      const directCustomer = await CustomerFactory.makeCustomer()
      
      const service = await ServiceFactory.makeService({ 
        name: 'Corte de Cabelo',
        category: 'Cabelo' 
      })
      
      const offer = await OfferFactory.makeOffer({ 
        service: { connect: { id: service.id } }
      })
      
      const appointment = await AppointmentsFactory.makeAppointments({ 
        offer: { connect: { id: offer.id } },
        customer: { connect: { id: directCustomer.id } }
      })

      const { token: directToken } = await getCustomerToken()
      
      const response = await request(app)
        .get('/api/appointments')
        .set({
          Authorization: `Bearer ${directToken}`
        })
        .query({ page: 1, limit: 10 })

      expect(response.status).toBe(200)
      expect(response.body).toBeDefined()
      expect(response.body.appointments).toHaveLength(1)
      expect(response.body.appointments[0]).toEqual(
        expect.objectContaining({
          id: appointment.id,
          customerId: directCustomer.id,
          appointmentDate: appointment.appointmentDate.toISOString()
        })
      )

      const customerFromDb = await prismaClient.customer.findUnique({
        where: { id: directCustomer.id },
        include: { referrer: true }
      })
      
      expect(customerFromDb?.referrer).toBeNull()
    })

    it('should maintain referral relationships for multiple referred customers', async () => {
      // Criar um cliente que fará múltiplas indicações
      const referrer = await CustomerFactory.makeCustomer()
      
      // Criar múltiplos clientes indicados
      const referredCustomers = await Promise.all([
        CustomerFactory.makeCustomer({ referrer: { connect: { id: referrer.id } } }),
        CustomerFactory.makeCustomer({ referrer: { connect: { id: referrer.id } } }),
        CustomerFactory.makeCustomer({ referrer: { connect: { id: referrer.id } } })
      ])
      
      // Criar serviço e oferta
      const service = await ServiceFactory.makeService({ 
        name: 'Corte de Cabelo',
        category: 'Cabelo' 
      })
      
      const offer = await OfferFactory.makeOffer({ 
        service: { connect: { id: service.id } }
      })
      
      // Criar agendamentos para todos os clientes indicados
      const appointments = await Promise.all(
        referredCustomers.map(referredCustomer => 
          AppointmentsFactory.makeAppointments({ 
            offer: { connect: { id: offer.id } },
            customer: { connect: { id: referredCustomer.id } }
          })
        )
      )

      // Verificar se todas as relações de indicação foram mantidas
      const referrerWithReferrals = await prismaClient.customer.findUnique({
        where: { id: referrer.id },
        include: { referrals: true }
      })

      expect(referrerWithReferrals?.referrals).toHaveLength(referredCustomers.length)
      referredCustomers.forEach(referredCustomer => {
        expect(referrerWithReferrals?.referrals).toContainEqual(
          expect.objectContaining({ id: referredCustomer.id })
        )
      })

      // Verificar se os agendamentos foram criados corretamente
      const { token } = await getCustomerToken()
      const response = await request(app)
        .get('/api/appointments')
        .set({ Authorization: `Bearer ${token}` })
        .query({ page: 1, limit: 10 })

      expect(response.status).toBe(200)
      expect(response.body.appointments).toHaveLength(appointments.length)
      appointments.forEach(appointment => {
        expect(response.body.appointments).toContainEqual(
          expect.objectContaining({
            id: appointment.id,
            appointmentDate: appointment.appointmentDate.toISOString()
          })
        )
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

    it('should return 400 if trying to create an appointment with invalid date', async () => {
      const offer = await OfferFactory.makeOffer()
      const appointment: Partial<Appointment> = {
        appointmentDate: new Date('invalid-date'),
        customerId: customer.id,
        serviceOfferedId: offer.id
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
        serviceOfferedId: offer.id
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
        serviceOfferedId: offer.id
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
          serviceOfferedId: offer.id
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
        serviceOfferedId: offer.id
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
