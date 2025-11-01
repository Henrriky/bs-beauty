import request from 'supertest'
import { getProfessionalToken } from './utils/auth'
import { app } from '@/app'
import { BlockedTimeFactory } from './factories/blocked-time.factory'
import { UserType, type Professional, type Prisma, type BlockedTime } from '@prisma/client'
import { prismaClient } from '@/lib/prisma'
import { faker } from '@faker-js/faker'
import * as luxon from 'luxon'

const convertBlockedTimeToResponseFormat = (blockedTime: BlockedTime) => {
  return {
    ...blockedTime,
    createdAt: blockedTime.createdAt.toISOString(),
    updatedAt: blockedTime.updatedAt.toISOString(),
    startTime: blockedTime.startTime.toISOString(),
    endTime: blockedTime?.endTime?.toISOString(),
    startDate: blockedTime.startDate.toISOString(),
    endDate: blockedTime?.endDate?.toISOString() ?? null
  }
}

describe('Blocked Times API (Integration Tests)', () => {
  let token: string
  let authenticatedProfessional: Professional

  beforeEach(async () => {
    const { token: tokenGenerated, professional: professionalGenerated } =
      await getProfessionalToken(UserType.PROFESSIONAL)
    token = tokenGenerated
    authenticatedProfessional = professionalGenerated
  })

  describe('GET /blocked-times', () => {
    it('should return an error when professional is not authenticated', async () => {
      const response = await request(app)
        .get('/api/blocked-times')

      expect(response.status).toBe(401)
    })

    describe('Professional Authenticated', () => {
      it('should return blocked times of the authenticated professional', async () => {
        await BlockedTimeFactory.makeBlockedTime()

        const blockedTimes = await Promise.all([
          await BlockedTimeFactory.makeBlockedTime({
            professional: {
              connect: {
                id: authenticatedProfessional.id
              }
            }
          }),
          await BlockedTimeFactory.makeBlockedTime({
            professional: {
              connect: {
                id: authenticatedProfessional.id
              }
            }
          })
        ])

        const response = await request(app)
          .get('/api/blocked-times')
          .set('Authorization', `Bearer ${token}`)

        expect(response.status).toBe(200)
        expect(response.body.data).toHaveLength(2)
        expect(response.body.data).toEqual(
          expect.arrayContaining(
            blockedTimes.map((blockedTime) => {
              return expect.objectContaining(convertBlockedTimeToResponseFormat(blockedTime))
            })
          )
        )
      })

      it('should return blocked times of the authenticated professional filtered by reason when reason is provided', async () => {
        const [blockedTime1] = await Promise.all([
          await BlockedTimeFactory.makeBlockedTime({
            reason: 'Vacation',
            professional: {
              connect: {
                id: authenticatedProfessional.id
              }
            }
          }),
          await BlockedTimeFactory.makeBlockedTime({
            reason: 'Sick Leave',
            professional: {
              connect: {
                id: authenticatedProfessional.id
              }
            }
          })
        ])

        const response = await request(app)
          .get('/api/blocked-times')
          .query({ reason: 'Vacation' })
          .set('Authorization', `Bearer ${token}`)

        expect(response.status).toBe(200)
        expect(response.body.data).toHaveLength(1)
        expect(response.body.data).toEqual(
          expect.arrayContaining([
            expect.objectContaining(convertBlockedTimeToResponseFormat(blockedTime1))
          ])
        )
      })

      it('should return a empty list when no blocked times exists for the authenticated professional', async () => {
        const response = await request(app)
          .get('/api/blocked-times')
          .set('Authorization', `Bearer ${token}`)

        expect(response.status).toBe(200)
        expect(response.body.data).toHaveLength(0)
        expect(response.body.data).toEqual([])
      })
    })

    describe('Manager Authenticated', () => {
      let managerToken: string

      beforeEach(async () => {
        const { token: tokenGenerated } = await getProfessionalToken(UserType.MANAGER)
        managerToken = tokenGenerated
      })

      it('should return all blocked times when manager is authenticated', async () => {
        const blockedTimes = await Promise.all([
          await BlockedTimeFactory.makeBlockedTime(),
          await BlockedTimeFactory.makeBlockedTime(),
          await BlockedTimeFactory.makeBlockedTime()
        ])

        const response = await request(app)
          .get('/api/blocked-times')
          .set('Authorization', `Bearer ${managerToken}`)

        expect(response.status).toBe(200)
        expect(response.body.data).toHaveLength(3)
        expect(response.body.data).toEqual(
          expect.arrayContaining(
            blockedTimes.map((blockedTime) => {
              return expect.objectContaining(convertBlockedTimeToResponseFormat(blockedTime))
            })
          )
        )
      })

      it('should return blocked times filtered by reason when manager is authenticated and reason is provided', async () => {
        const [blockedTime1] = await Promise.all([
          await BlockedTimeFactory.makeBlockedTime({
            reason: 'Vacation'
          }),
          await BlockedTimeFactory.makeBlockedTime({
            reason: 'Sick Leave'
          })
        ])

        const response = await request(app)
          .get('/api/blocked-times')
          .query({ reason: blockedTime1.reason })
          .set('Authorization', `Bearer ${managerToken}`)

        expect(response.status).toBe(200)
        expect(response.body.data).toHaveLength(1)
        expect(response.body.data).toEqual(
          expect.arrayContaining([
            expect.objectContaining(convertBlockedTimeToResponseFormat(blockedTime1))
          ])
        )
      })

      it('should return a empty list when no blocked times exists', async () => {
        const response = await request(app)
          .get('/api/blocked-times')
          .set('Authorization', `Bearer ${managerToken}`)

        expect(response.status).toBe(200)
        expect(response.body.data).toHaveLength(0)
        expect(response.body.data).toEqual([])
      })
    })
  })

  describe('GET /blocked-times/:id', () => {
    it('should return 401 when trying to get a blocked time without authentication', async () => {
      const response = await request(app)
        .get(`/api/blocked-times/${faker.string.uuid()}`)

      expect(response.status).toBe(401)
    })

    describe('Professional Authenticated', () => {
      it('should return 404 when trying to get a non-existing blocked time', async () => {
        const response = await request(app)
          .get(`/api/blocked-times/${faker.string.uuid()}`)
          .set('Authorization', `Bearer ${token}`)

        expect(response.status).toBe(404)
      })

      it('should return 403 when trying to get a blocked time of another professional', async () => {
        const blockedTime = await BlockedTimeFactory.makeBlockedTime()
        const response = await request(app)
          .get(`/api/blocked-times/${blockedTime.id}`)
          .set('Authorization', `Bearer ${token}`)

        expect(response.status).toBe(403)
      })

      it('should return the blocked time when the professional is authenticated and owns the blocked time', async () => {
        const blockedTime = await BlockedTimeFactory.makeBlockedTime({
          professional: {
            connect: {
              id: authenticatedProfessional.id
            }
          }
        })

        const response = await request(app)
          .get(`/api/blocked-times/${blockedTime.id}`)
          .set('Authorization', `Bearer ${token}`)

        expect(response.status).toBe(200)
        expect(response.body).toMatchObject(convertBlockedTimeToResponseFormat(blockedTime))
      })
    })

    describe('Manager Authenticated', () => {
      let managerToken: string

      beforeEach(async () => {
        const { token: tokenGenerated } = await getProfessionalToken(UserType.MANAGER)
        managerToken = tokenGenerated
      })

      it('should return 404 when trying to get a non-existing blocked time', async () => {
        const response = await request(app)
          .get(`/api/blocked-times/${faker.string.uuid()}`)
          .set('Authorization', `Bearer ${managerToken}`)

        expect(response.status).toBe(404)
      })

      it('should return the blocked time when manager is authenticated and the blocked time is of any professional different than himself', async () => {
        const blockedTime = await BlockedTimeFactory.makeBlockedTime()

        const response = await request(app)
          .get(`/api/blocked-times/${blockedTime.id}`)
          .set('Authorization', `Bearer ${managerToken}`)

        expect(response.status).toBe(200)
        expect(response.body).toMatchObject(convertBlockedTimeToResponseFormat(blockedTime))
      })
    })
  })

  describe('GET /professionals/:professionalId/blocked-times', () => {
    it('should return filtered blocked times when exists blocked times with end date null and start date is before end date provided', async () => {
      const now = new Date()
      const startDate = luxon.DateTime.fromJSDate(now)
      const endDate = luxon.DateTime.fromJSDate(now).plus({ days: 31 })
      await BlockedTimeFactory.makeBlockedTime({
        startDate: startDate.toJSDate(),
        endDate: null,
        isActive: false
      })
      await BlockedTimeFactory.makeBlockedTime({
        startDate: startDate.toJSDate(),
        endDate: null,
        sunday: false,
        monday: false,
        tuesday: false,
        wednesday: false,
        thursday: false,
        friday: false,
        saturday: false
      })
      await BlockedTimeFactory.makeBlockedTime({
        startDate: startDate.toJSDate(),
        endDate: startDate.plus({ days: 10 }).toJSDate(),
        isActive: false
      })

      const blockedTimes = await Promise.all([
        await BlockedTimeFactory.makeBlockedTime({
          startDate: startDate.toJSDate(),
          professional: { connect: { id: authenticatedProfessional.id } },
          endDate: null
        }),
        await BlockedTimeFactory.makeBlockedTime({
          startDate: startDate.plus({ days: 15 }).toJSDate(),
          professional: { connect: { id: authenticatedProfessional.id } },
          endDate: null
        })
      ])

      const response = await request(app)
        .get(`/api/professionals/${authenticatedProfessional.id}/blocked-times`)
        .set('Authorization', `Bearer ${token}`)
        .query({
          startDate: startDate.toISO(),
          endDate: endDate.toISO()
        })
      expect(response.status).toBe(200)
      expect(response.body.data.length).toBe(blockedTimes.length)
      expect(response.body.data).toEqual(
        expect.arrayContaining(
          blockedTimes.map((blockedTime) => {
            return expect.objectContaining(convertBlockedTimeToResponseFormat(blockedTime))
          })
        )
      )
    })

    it('should return filtered blocked times when exists blocked times with end date is after start date and before end date provided', async () => {
      const now = new Date()
      const startDate = luxon.DateTime.fromJSDate(now)
      const endDate = luxon.DateTime.fromJSDate(now).plus({ days: 25 })
      await BlockedTimeFactory.makeBlockedTime({
        startDate: startDate.toJSDate(),
        endDate: null,
        isActive: false
      })
      await BlockedTimeFactory.makeBlockedTime({
        startDate: startDate.toJSDate(),
        endDate: null,
        sunday: false,
        monday: false,
        tuesday: false,
        wednesday: false,
        thursday: false,
        friday: false,
        saturday: false
      })
      await BlockedTimeFactory.makeBlockedTime({
        startDate: startDate.toJSDate(),
        endDate: startDate.plus({ days: 10 }).toJSDate(),
        isActive: false
      })

      const blockedTimes = await Promise.all([
        await BlockedTimeFactory.makeBlockedTime({
          startDate: startDate.toJSDate(),
          endDate: startDate.plus({ days: 20 }).toJSDate(),
          professional: { connect: { id: authenticatedProfessional.id } }
        }),
        await BlockedTimeFactory.makeBlockedTime({
          startDate: startDate.plus({ days: 5 }).toJSDate(),
          endDate: startDate.plus({ days: 15 }).toJSDate(),
          professional: { connect: { id: authenticatedProfessional.id } }
        })
      ])

      const response = await request(app)
        .get(`/api/professionals/${authenticatedProfessional.id}/blocked-times`)
        .set('Authorization', `Bearer ${token}`)
        .query({
          startDate: startDate.toISO(),
          endDate: endDate.toISO()
        })

      expect(response.status).toBe(200)
      expect(response.body.data.length).toBe(blockedTimes.length)
      expect(response.body.data).toEqual(
        expect.arrayContaining(
          blockedTimes.map((blockedTime) => {
            return expect.objectContaining(convertBlockedTimeToResponseFormat(blockedTime))
          })
        )
      )
    })

    it('should return filtered blocked times when exists blocked times with least one weekday active and match with filter', async () => {
      const now = new Date()
      const startDate = luxon.DateTime.fromJSDate(now)
      const endDate = luxon.DateTime.fromJSDate(now).plus({ days: 15 })
      await BlockedTimeFactory.makeBlockedTime({
        startDate: startDate.toJSDate(),
        endDate: null,
        isActive: false
      })
      await BlockedTimeFactory.makeBlockedTime({
        startDate: startDate.toJSDate(),
        endDate: null,
        sunday: false,
        monday: false,
        tuesday: false,
        wednesday: false,
        thursday: false,
        friday: false,
        saturday: false
      })
      await BlockedTimeFactory.makeBlockedTime({
        startDate: startDate.toJSDate(),
        endDate: startDate.plus({ days: 10 }).toJSDate(),
        isActive: false
      })

      const blockedTimes = await Promise.all([
        await BlockedTimeFactory.makeBlockedTime({
          startDate: startDate.toJSDate(),
          endDate: endDate.toJSDate(),
          monday: true,
          tuesday: false,
          wednesday: false,
          thursday: false,
          friday: false,
          saturday: false,
          sunday: false,
          professional: { connect: { id: authenticatedProfessional.id } }
        })
      ])

      const response = await request(app)
        .get(`/api/professionals/${authenticatedProfessional.id}/blocked-times`)
        .set('Authorization', `Bearer ${token}`)
        .query({
          startDate: startDate.toISO(),
          endDate: endDate.toISO()
        })

      expect(response.status).toBe(200)
      expect(response.body.data.length).toBe(blockedTimes.length)
      expect(response.body.data).toEqual(
        expect.arrayContaining(
          blockedTimes.map((blockedTime) => {
            return expect.objectContaining(convertBlockedTimeToResponseFormat(blockedTime))
          })
        )
      )
    })

    it('should not return blocked times when has blocked times with isActive false', async () => {
      const now = new Date()
      const startDate = luxon.DateTime.fromJSDate(now)
      const endDate = luxon.DateTime.fromJSDate(now).plus({ days: 31 })
      await BlockedTimeFactory.makeBlockedTime({
        startDate: startDate.toJSDate(),
        endDate: null,
        isActive: false
      })
      await BlockedTimeFactory.makeBlockedTime({
        startDate: startDate.toJSDate(),
        endDate: startDate.plus({ days: 10 }).toJSDate(),
        isActive: false
      })

      const response = await request(app)
        .get(`/api/professionals/${authenticatedProfessional.id}/blocked-times`)
        .set('Authorization', `Bearer ${token}`)
        .query({
          startDate: startDate.toISO(),
          endDate: endDate.toISO()
        })

      expect(response.status).toBe(200)
      expect(response.body.data).toHaveLength(0)
    })

    it('should return 400 when trying to filter by a period greather than 31 days', async () => {
      const now = new Date()
      const startDate = luxon.DateTime.fromJSDate(now).toISO()
      const endDate = luxon.DateTime.fromJSDate(now).plus({ days: 32 }).toISO()

      const response = await request(app)
        .get(`/api/professionals/${authenticatedProfessional.id}/blocked-times`)
        .set('Authorization', `Bearer ${token}`)
        .query({
          startDate,
          endDate
        })

      expect(response.status).toBe(400)
    })

    it('should return 404 when trying to get blocked times from a professional that does not exists', async () => {
      const now = new Date()
      const startDate = luxon.DateTime.fromJSDate(now).toISO()
      const endDate = luxon.DateTime.fromJSDate(now).plus({ days: 29 }).toISO()

      const response = await request(app)
        .get(`/api/professionals/${faker.string.uuid()}/blocked-times`)
        .set('Authorization', `Bearer ${token}`)
        .query({
          startDate,
          endDate
        })

      expect(response.status).toBe(404)
    })
  })

  describe('POST /blocked-times', () => {
    it('should return an 401 when trying to create a blocked time without authentication', async () => {
      const blockedTimeData: Prisma.BlockedTimeCreateInput = {
        reason: 'Vacation',
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-01-05'),
        startTime: new Date('2024-01-01T10:00:00Z'),
        endTime: new Date('2024-01-01T12:00:00Z')
      }

      const response = await request(app)
        .post('/api/blocked-times')
        .send(blockedTimeData)

      expect(response.status).toBe(401)
    })

    it('should create a blocked time for the authenticated professional when blocked time is valid', async () => {
      const blockedTimeData: Prisma.BlockedTimeCreateInput = {
        reason: 'Vacation',
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-01-05'),
        startTime: new Date('1970-01-01T07:00:00.000Z'),
        endTime: new Date('1970-01-01T09:00:00.000Z'),
        sunday: true,
        monday: false,
        tuesday: true,
        wednesday: false,
        thursday: true,
        friday: false,
        saturday: true,
        isActive: true
      }

      const response = await request(app)
        .post('/api/blocked-times')
        .set('Authorization', `Bearer ${token}`)
        .send(blockedTimeData)

      expect(response.status).toBe(201)

      const blockedTimeOnPrisma = await prismaClient.blockedTime.findFirst()

      expect(blockedTimeOnPrisma).toMatchObject({
        reason: blockedTimeData.reason,
        professionalId: authenticatedProfessional.id,
        sunday: blockedTimeData.sunday,
        monday: blockedTimeData.monday,
        tuesday: blockedTimeData.tuesday,
        wednesday: blockedTimeData.wednesday,
        thursday: blockedTimeData.thursday,
        friday: blockedTimeData.friday,
        saturday: blockedTimeData.saturday,
        isActive: blockedTimeData.isActive
      })

      expect(blockedTimeOnPrisma?.startDate?.getTime()).toBe((blockedTimeData.startDate as Date).getTime())
      expect(blockedTimeOnPrisma?.endDate?.getTime()).toBe((blockedTimeData.endDate as Date).getTime())
      expect(blockedTimeOnPrisma?.startTime?.getTime()).toBe((blockedTimeData.startTime as Date).getTime())
      expect(blockedTimeOnPrisma?.endTime?.getTime()).toBe((blockedTimeData?.endTime as Date).getTime())
    })

    it('should return an 400 when trying to create a blocked time with invalid data', async () => {
      const blockedTimeData = {
        reason: '',
        startDate: 'invalid-date',
        endDate: 'invalid-date',
        startTime: 'invalid-time',
        endTime: 'invalid-time'
      }

      const response = await request(app)
        .post('/api/blocked-times')
        .set('Authorization', `Bearer ${token}`)
        .send(blockedTimeData)

      expect(response.status).toBe(400)
    })

    it('should return an 400 when trying to create a blocked time endDate is before startDate', async () => {
      const blockedTimeData: Prisma.BlockedTimeCreateInput = {
        reason: 'Vacation',
        startDate: new Date('2024-01-05'),
        endDate: new Date('2024-01-01'),
        startTime: new Date('2024-01-01T10:00:00Z'),
        endTime: new Date('2024-01-01T12:00:00Z')
      }

      const response = await request(app)
        .post('/api/blocked-times')
        .set('Authorization', `Bearer ${token}`)
        .send(blockedTimeData)

      expect(response.status).toBe(400)
    })

    it('should return an 400 when trying to create a blocked time endTime is before startTime', async () => {
      const blockedTimeData: Prisma.BlockedTimeCreateInput = {
        reason: 'Vacation',
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-01-05'),
        startTime: new Date('2024-01-01T12:00:00Z'),
        endTime: new Date('2024-01-01T10:00:00Z')
      }

      const response = await request(app)
        .post('/api/blocked-times')
        .set('Authorization', `Bearer ${token}`)
        .send(blockedTimeData)

      expect(response.status).toBe(400)
    })
  })

  describe('PUT /blocked-times/:id', () => {
    it('should return 401 when trying to update a blocked time without authentication', async () => {
      const response = await request(app)
        .put('/api/blocked-times/some-id')
        .send({
          reason: 'Updated Reason'
        })

      expect(response.status).toBe(401)
    })

    it('should return 404 when trying to update a non-existing blocked time', async () => {
      const blockedTime = await BlockedTimeFactory.makeBlockedTime()

      const response = await request(app)
        .put(`/api/blocked-times/${faker.string.uuid()}`)
        .set('Authorization', `Bearer ${token}`)
        .send(blockedTime)

      expect(response.status).toBe(404)
    })

    it('should return 403 when trying to update a blocked time of another professional', async () => {
      const blockedTime = await BlockedTimeFactory.makeBlockedTime()

      const response = await request(app)
        .put(`/api/blocked-times/${blockedTime.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send(blockedTime)
      expect(response.status).toBe(403)
    })

    it('should update the blocked time when the professional is authenticated and owns the blocked time', async () => {
      const blockedTime = await BlockedTimeFactory.makeBlockedTime({
        professional: {
          connect: {
            id: authenticatedProfessional.id
          }
        }
      })

      const blockedTimeUpdateData: Prisma.BlockedTimeUpdateInput = {
        ...blockedTime,
        reason: 'Updated Reason',
        isActive: false
      }

      const response = await request(app)
        .put(`/api/blocked-times/${blockedTime.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send(blockedTimeUpdateData)
      expect(response.status).toBe(200)
      expect(response.body).contains({
        reason: blockedTimeUpdateData.reason,
        isActive: blockedTimeUpdateData.isActive
      })
    })

    it('should return 400 when trying to update a blocked time with invalid data', async () => {
      const blockedTimeUpdateData = {
        reason: '',
        startDate: 'invalid-date',
        endDate: 'invalid-date',
        startTime: 'invalid-time',
        endTime: 'invalid-time'
      }

      const response = await request(app)
        .put('/api/blocked-times/some-id')
        .set('Authorization', `Bearer ${token}`)
        .send(blockedTimeUpdateData)

      expect(response.status).toBe(400)
    })

    it('should return 400 when trying to update a blocked time with endDate before startDate', async () => {
      const blockedTime = await BlockedTimeFactory.makeBlockedTime({
        professional: {
          connect: {
            id: authenticatedProfessional.id
          }
        }
      })

      const blockedTimeUpdateData: Prisma.BlockedTimeUpdateInput = {
        ...blockedTime,
        startDate: new Date('2024-01-05'),
        endDate: new Date('2024-01-01')
      }

      const response = await request(app)
        .put(`/api/blocked-times/${blockedTime.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send(blockedTimeUpdateData)

      expect(response.status).toBe(400)
    })

    it('should return 400 when trying to update a blocked time with endDate before startDate', async () => {
      const blockedTime = await BlockedTimeFactory.makeBlockedTime({
        professional: {
          connect: {
            id: authenticatedProfessional.id
          }
        }
      })

      const blockedTimeUpdateData: Prisma.BlockedTimeUpdateInput = {
        ...blockedTime,
        startTime: new Date('2024-01-01T12:00:00Z'),
        endTime: new Date('2024-01-01T10:00:00Z')
      }

      const response = await request(app)
        .put(`/api/blocked-times/${blockedTime.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send(blockedTimeUpdateData)

      expect(response.status).toBe(400)
    })
  })

  describe('DELETE /blocked-times/:id', () => {
    it('should return 401 when trying to delete a blocked time without authentication', async () => {
      const response = await request(app)
        .delete('/api/blocked-times/some-id')

      expect(response.status).toBe(401)
    })

    describe('Professional Authenticated', () => {
      it('should return 404 when trying to delete a non-existing blocked time', async () => {
        const response = await request(app)
          .delete(`/api/blocked-times/${faker.string.uuid()}`)
          .set('Authorization', `Bearer ${token}`)

        expect(response.status).toBe(404)
      })

      it('should return 403 when trying to delete a blocked time of another professional', async () => {
        const blockedTime = await BlockedTimeFactory.makeBlockedTime()
        const response = await request(app)
          .delete(`/api/blocked-times/${blockedTime.id}`)
          .set('Authorization', `Bearer ${token}`)

        expect(response.status).toBe(403)
      })

      it('should return 200 and delete the blocked time when the professional is authenticated and owns the blocked time', async () => {
        const blockedTime = await BlockedTimeFactory.makeBlockedTime({
          professional: {
            connect: {
              id: authenticatedProfessional.id
            }
          }
        })

        const response = await request(app)
          .delete(`/api/blocked-times/${blockedTime.id}`)
          .set('Authorization', `Bearer ${token}`)

        expect(response.status).toBe(200)

        const blockedTimeOnPrisma = await prismaClient.blockedTime.findUnique({
          where: {
            id: blockedTime.id
          }
        })

        expect(blockedTimeOnPrisma).toBeNull()
      })
    })

    describe('Manager Authenticated', () => {
      let managerToken: string

      beforeEach(async () => {
        const { token: tokenGenerated } = await getProfessionalToken(UserType.MANAGER)
        managerToken = tokenGenerated
      })

      it('should return 404 when trying to delete a non-existing blocked time', async () => {
        const response = await request(app)
          .delete(`/api/blocked-times/${faker.string.uuid()}`)
          .set('Authorization', `Bearer ${managerToken}`)

        expect(response.status).toBe(404)
      })

      it('should return 200 and delete the blocked time when manager is authenticated and the blocked time is of any professional different than himself', async () => {
        const blockedTime = await BlockedTimeFactory.makeBlockedTime()

        const response = await request(app)
          .delete(`/api/blocked-times/${blockedTime.id}`)
          .set('Authorization', `Bearer ${managerToken}`)

        expect(response.status).toBe(200)

        const blockedTimeOnPrisma = await prismaClient.blockedTime.findUnique({
          where: {
            id: blockedTime.id
          }
        })

        expect(blockedTimeOnPrisma).toBeNull()
      })
    })
  })
})
