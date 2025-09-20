import { type Professional } from '@prisma/client'
import request from 'supertest'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { app } from '../../app'
import { getProfessionalToken } from './utils/auth'
import { faker } from '@faker-js/faker'
import { spyProfessionalsWiring } from './utils/employees-spies'
import { ProfessionalFactory } from './factories/professional.factory'
import { ServiceFactory } from './factories/service.factory'
import { OfferFactory } from './factories/offer.factory'

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

  describe('[GET] /api/professionals/:id/offers/service', () => {
    it('should return services offered by a professional', async () => {
      // arrange
      const professional = await ProfessionalFactory.makeProfessional()

      const service1 = await ServiceFactory.makeService({
        name: 'Service One',
        category: 'Category One',
        description: 'Description One'
      })

      const service2 = await ServiceFactory.makeService({
        name: 'Service Two',
        category: 'Category Two',
        description: 'Description Two'
      })

      await Promise.all([
        OfferFactory.makeOffer({
          service: { connect: { id: service1.id } },
          professional: { connect: { id: professional.id } }
        }),
        OfferFactory.makeOffer({
          service: { connect: { id: service2.id } },
          professional: { connect: { id: professional.id } }
        })
      ])

      const spies = spyProfessionalsWiring()

      // act
      const response = await request(app)
        .get(`/api/professionals/${professional.id}/offers/service`)
        .set('Authorization', `Bearer ${token}`)
        .query({ page: 1, limit: 10 })

      // assert
      expect(response.status).toBe(200)
      expect(response.body.professional.offers).toHaveLength(2)
      expect(response.body.professional.offers.map((offer: any) => offer.service.name)).toEqual(
        expect.arrayContaining([service1.name, service2.name])
      )

      expect(spies.usecase.fetchServicesOfferedByProfessional).toHaveBeenCalledTimes(1)
      expect(spies.repository.fetchServicesOfferedByProfessional).toHaveBeenCalledTimes(1)
    })

    describe('when filtering with "q" query parameter', () => {
      it('should return services filtered by name when "q" matches service name', async () => {
        const professional = await ProfessionalFactory.makeProfessional()
        const nameToSearch = 'Hair Cut Service'

        const [service1, service2, service3] = await Promise.all([
          ServiceFactory.makeService({
            name: nameToSearch,
            category: 'Hair',
            description: 'Professional hair cutting'
          }),
          ServiceFactory.makeService({
            name: nameToSearch,
            category: 'Hair',
            description: 'Professional hair styling'
          }),
          ServiceFactory.makeService({
            name: 'Massage Service',
            category: 'Wellness',
            description: 'Relaxing massage'
          })
        ])

        await Promise.all([
          OfferFactory.makeOffer({
            service: { connect: { id: service1.id } },
            professional: { connect: { id: professional.id } }
          }),
          OfferFactory.makeOffer({
            service: { connect: { id: service2.id } },
            professional: { connect: { id: professional.id } }
          }),
          OfferFactory.makeOffer({
            service: { connect: { id: service3.id } },
            professional: { connect: { id: professional.id } }
          })
        ])

        const response = await request(app)
          .get(`/api/professionals/${professional.id}/offers/service`)
          .set('Authorization', `Bearer ${token}`)
          .query({ page: 1, limit: 10, q: nameToSearch })

        expect(response.status).toBe(200)
        expect(response.body.professional.offers).toHaveLength(2)
        expect(response.body.professional.offers.map((offer: any) => offer.service.name)).toEqual(
          expect.arrayContaining([service1.name, service2.name])
        )
      })

      it('should return services filtered by description when "q" matches service description', async () => {
        const professional = await ProfessionalFactory.makeProfessional()
        const descriptionToSearch = 'Professional Treatment'

        const [service1, service2, service3] = await Promise.all([
          ServiceFactory.makeService({
            name: 'Hair Service',
            category: 'Hair',
            description: descriptionToSearch
          }),
          ServiceFactory.makeService({
            name: 'Skin Service',
            category: 'Skincare',
            description: descriptionToSearch
          }),
          ServiceFactory.makeService({
            name: 'Massage Service',
            category: 'Wellness',
            description: 'Relaxing massage'
          })
        ])

        await Promise.all([
          OfferFactory.makeOffer({
            service: { connect: { id: service1.id } },
            professional: { connect: { id: professional.id } }
          }),
          OfferFactory.makeOffer({
            service: { connect: { id: service2.id } },
            professional: { connect: { id: professional.id } }
          }),
          OfferFactory.makeOffer({
            service: { connect: { id: service3.id } },
            professional: { connect: { id: professional.id } }
          })
        ])

        const response = await request(app)
          .get(`/api/professionals/${professional.id}/offers/service`)
          .set('Authorization', `Bearer ${token}`)
          .query({ page: 1, limit: 10, q: descriptionToSearch })

        expect(response.status).toBe(200)
        expect(response.body.professional.offers).toHaveLength(2)
        expect(response.body.professional.offers.map((offer: any) => offer.service.description)).toEqual(
          expect.arrayContaining([service1.description, service2.description])
        )
      })

      it('should return empty offers array when "q" parameter matches no services', async () => {
        const professional = await ProfessionalFactory.makeProfessional()

        await ServiceFactory.makeService({
          name: 'Completely Different Service',
          category: 'Different Category',
          description: 'Different description'
        })

        const response = await request(app)
          .get(`/api/professionals/${professional.id}/offers/service`)
          .set('Authorization', `Bearer ${token}`)
          .query({ page: 1, limit: 10, q: 'NonExistentSearchTerm' })

        expect(response.status).toBe(200)
        expect(response.body.professional.offers).toHaveLength(0)
      })
    })

    describe('when filtering with "category" query parameter', () => {
      it('should return services filtered by category', async () => {
        const professional = await ProfessionalFactory.makeProfessional()
        const categoryToSearch = 'Hair Services'

        const [service1, service2, service3] = await Promise.all([
          ServiceFactory.makeService({
            name: 'Hair Cut',
            category: categoryToSearch,
            description: 'Professional hair cutting'
          }),
          ServiceFactory.makeService({
            name: 'Hair Color',
            category: categoryToSearch,
            description: 'Professional hair coloring'
          }),
          ServiceFactory.makeService({
            name: 'Massage',
            category: 'Wellness',
            description: 'Relaxing massage'
          })
        ])

        await Promise.all([
          OfferFactory.makeOffer({
            service: { connect: { id: service1.id } },
            professional: { connect: { id: professional.id } }
          }),
          OfferFactory.makeOffer({
            service: { connect: { id: service2.id } },
            professional: { connect: { id: professional.id } }
          }),
          OfferFactory.makeOffer({
            service: { connect: { id: service3.id } },
            professional: { connect: { id: professional.id } }
          })
        ])

        const response = await request(app)
          .get(`/api/professionals/${professional.id}/offers/service`)
          .set('Authorization', `Bearer ${token}`)
          .query({ page: 1, limit: 10, category: categoryToSearch })

        expect(response.status).toBe(200)
        expect(response.body.professional.offers).toHaveLength(2)
        expect(response.body.professional.offers.map((offer: any) => offer.service.category)).toEqual(
          expect.arrayContaining([service1.category, service2.category])
        )
      })

      it('should return empty offers array when "category" parameter matches no services', async () => {
        const professional = await ProfessionalFactory.makeProfessional()

        const service = await ServiceFactory.makeService({
          name: 'Service',
          category: 'Different Category',
          description: 'Description'
        })

        await OfferFactory.makeOffer({
          service: { connect: { id: service.id } },
          professional: { connect: { id: professional.id } }
        })

        const response = await request(app)
          .get(`/api/professionals/${professional.id}/offers/service`)
          .set('Authorization', `Bearer ${token}`)
          .query({ page: 1, limit: 10, category: 'NonExistentCategory' })

        expect(response.status).toBe(200)
        expect(response.body.professional.offers).toHaveLength(0)
      })
    })

    describe('when combining filters', () => {
      it('should return services matching both "q" and "category" parameters', async () => {
        const professional = await ProfessionalFactory.makeProfessional()
        const categoryToSearch = 'Hair Services'
        const nameToSearch = 'Premium'

        const [service1, service2] = await Promise.all([
          ServiceFactory.makeService({
            name: 'Premium Hair Cut',
            category: categoryToSearch,
            description: 'High-end hair cutting'
          }),
          ServiceFactory.makeService({
            name: 'Basic Hair Cut',
            category: categoryToSearch,
            description: 'Standard hair cutting'
          }),
          ServiceFactory.makeService({
            name: 'Premium Facial',
            category: 'Skincare',
            description: 'High-end facial treatment'
          })
        ])

        await Promise.all([
          OfferFactory.makeOffer({
            service: { connect: { id: service1.id } },
            professional: { connect: { id: professional.id } }
          }),
          OfferFactory.makeOffer({
            service: { connect: { id: service2.id } },
            professional: { connect: { id: professional.id } }
          }),
          OfferFactory.makeOffer({
            service: { connect: { id: service2.id } },
            professional: { connect: { id: professional.id } }
          })
        ])

        const response = await request(app)
          .get(`/api/professionals/${professional.id}/offers/service`)
          .set('Authorization', `Bearer ${token}`)
          .query({ page: 1, limit: 10, q: nameToSearch, category: categoryToSearch })

        expect(response.status).toBe(200)
        expect(response.body.professional.offers).toHaveLength(1)
        expect(response.body.professional.offers[0].service.name).toBe(service1.name)
        expect(response.body.professional.offers[0].service.category).toBe(service1.category)
      })
    })
  })
})
