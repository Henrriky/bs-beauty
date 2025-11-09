/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { type BlockedTime, UserType } from '@prisma/client'
import { StatusCodes } from 'http-status-codes'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { BlockedTimesController } from '../../../controllers/blocked-times.controller'
import { makeBlockedTimesUseCaseFactory } from '../../../factory/make-blocked-times-use-case.factory'
import { mockRequest, type MockRequest, mockResponse } from '../utils/test-utilts'
import { faker } from '@faker-js/faker'

vi.mock('@/factory/make-blocked-times-use-case.factory')

describe('BlockedTimesController (Unit Tests)', () => {
  let req: MockRequest
  let res: any
  let next: any
  let useCaseMock: any

  beforeEach(() => {
    vi.clearAllMocks()

    req = mockRequest({
      user: {
        id: 'user-123',
        userType: UserType.PROFESSIONAL,
        email: 'test@example.com',
        name: 'Test User',
        registerCompleted: true,
        googleId: '',
        profilePhotoUrl: '',
        userId: 'user-123',
        permissions: []
      }
    })

    res = mockResponse()
    next = vi.fn()

    useCaseMock = {
      executeFindAllPaginated: vi.fn(),
      executeCreate: vi.fn(),
      executeUpdate: vi.fn(),
      executeFindById: vi.fn(),
      executeDelete: vi.fn(),
      executeFindByProfessionalAndPeriod: vi.fn()
    }

    vi.mocked(makeBlockedTimesUseCaseFactory).mockReturnValue(useCaseMock)

    // Reset the static useCase to use the mock
    BlockedTimesController.useCase = useCaseMock
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should be defined', () => {
    expect(BlockedTimesController).toBeDefined()
  })

  describe('handleFindAllPaginated', () => {
    it('should return paginated blocked times', async () => {
      const mockResult = {
        data: [
          {
            id: faker.string.uuid(),
            professionalId: 'user-123',
            startDate: faker.date.future(),
            endDate: faker.date.future(),
            startTime: faker.date.future(),
            endTime: faker.date.future(),
            reason: faker.lorem.sentence(),
            isActive: true,
            monday: false,
            tuesday: false,
            wednesday: false,
            thursday: false,
            friday: false,
            saturday: false,
            sunday: false,
            createdAt: faker.date.past(),
            updatedAt: faker.date.past(),
            professional: {
              name: 'Test User'
            }
          }
        ],
        total: 1,
        page: 1,
        totalPages: 1,
        limit: 10
      }

      req.query = { page: '1', limit: '10' }
      useCaseMock.executeFindAllPaginated.mockResolvedValueOnce(mockResult)

      await BlockedTimesController.handleFindAllPaginated(req, res, next)

      expect(useCaseMock.executeFindAllPaginated).toHaveBeenCalledTimes(1)
      expect(useCaseMock.executeFindAllPaginated).toHaveBeenCalledWith({
        userId: 'user-123',
        userType: UserType.PROFESSIONAL,
        permissions: [],
        extra: {
          page: 1,
          limit: 10,
          filters: {}
        }
      })
      expect(res.send).toHaveBeenCalledWith(mockResult)
      expect(next).not.toHaveBeenCalled()
    })

    it('should call next with an error if executeFindAllPaginated fails', async () => {
      const error = new Error('Database connection failed')
      req.query = { page: '1', limit: '10' }
      useCaseMock.executeFindAllPaginated.mockRejectedValueOnce(error)

      await BlockedTimesController.handleFindAllPaginated(req, res, next)

      expect(useCaseMock.executeFindAllPaginated).toHaveBeenCalledTimes(1)
      expect(res.send).not.toHaveBeenCalled()
      expect(next).toHaveBeenCalledTimes(1)
      expect(next).toHaveBeenCalledWith(error)
    })
  })

  describe('handleCreate', () => {
    it('should create blocked time successfully', async () => {
      const blockedTimeData = {
        professional: { connect: { id: 'user-123' } },
        startDate: new Date('2024-01-01T09:00:00'),
        endDate: new Date('2024-01-01T18:00:00'),
        startTime: new Date('2024-01-01T09:00:00'),
        endTime: new Date('2024-01-01T10:00:00'),
        reason: faker.lorem.sentence()
      }

      req.body = blockedTimeData
      useCaseMock.executeCreate.mockResolvedValueOnce(undefined)

      await BlockedTimesController.handleCreate(req, res, next)

      expect(useCaseMock.executeCreate).toHaveBeenCalledTimes(1)
      expect(useCaseMock.executeCreate).toHaveBeenCalledWith({
        id: 'user-123',
        userType: UserType.PROFESSIONAL,
        email: 'test@example.com',
        name: 'Test User',
        registerCompleted: true,
        googleId: '',
        profilePhotoUrl: '',
        userId: 'user-123',
        permissions: [],
        extra: blockedTimeData
      })
      expect(res.status).toHaveBeenCalledWith(StatusCodes.CREATED)
      expect(res.send).toHaveBeenCalled()
      expect(next).not.toHaveBeenCalled()
    })

    it('should call next with an error if executeCreate fails', async () => {
      const error = new Error('Creation failed')
      const blockedTimeData = {
        professional: { connect: { id: 'user-123' } },
        startDate: new Date('2024-01-01T09:00:00'),
        endDate: new Date('2024-01-01T18:00:00'),
        startTime: new Date('2024-01-01T09:00:00'),
        endTime: new Date('2024-01-01T10:00:00'),
        reason: faker.lorem.sentence()
      }

      req.body = blockedTimeData
      useCaseMock.executeCreate.mockRejectedValueOnce(error)

      await BlockedTimesController.handleCreate(req, res, next)

      expect(useCaseMock.executeCreate).toHaveBeenCalledTimes(1)
      expect(res.status).not.toHaveBeenCalled()
      expect(res.send).not.toHaveBeenCalled()
      expect(next).toHaveBeenCalledTimes(1)
      expect(next).toHaveBeenCalledWith(error)
    })
  })

  describe('handleUpdate', () => {
    it('should update blocked time successfully', async () => {
      const blockedTimeId = faker.string.uuid()
      const updateData = {
        reason: 'Updated reason'
      }
      const updatedBlockedTime: BlockedTime = {
        id: blockedTimeId,
        professionalId: 'user-123',
        startDate: new Date('2024-01-01T09:00:00'),
        endDate: new Date('2024-01-01T18:00:00'),
        startTime: new Date('2024-01-01T09:00:00'),
        endTime: new Date('2024-01-01T10:00:00'),
        reason: updateData.reason,
        isActive: true,
        monday: false,
        tuesday: false,
        wednesday: false,
        thursday: false,
        friday: false,
        saturday: false,
        sunday: false,
        createdAt: faker.date.past(),
        updatedAt: faker.date.past()
      }

      req.params.id = blockedTimeId
      req.body = updateData
      useCaseMock.executeUpdate.mockResolvedValueOnce(updatedBlockedTime)

      await BlockedTimesController.handleUpdate(req, res, next)

      expect(useCaseMock.executeUpdate).toHaveBeenCalledTimes(1)
      expect(useCaseMock.executeUpdate).toHaveBeenCalledWith(blockedTimeId, {
        id: 'user-123',
        userType: UserType.PROFESSIONAL,
        email: 'test@example.com',
        name: 'Test User',
        registerCompleted: true,
        googleId: '',
        profilePhotoUrl: '',
        userId: 'user-123',
        permissions: [],
        extra: updateData
      })
      expect(res.status).toHaveBeenCalledWith(StatusCodes.OK)
      expect(res.send).toHaveBeenCalledWith(updatedBlockedTime)
      expect(next).not.toHaveBeenCalled()
    })

    it('should call next with an error if executeUpdate fails', async () => {
      const error = new Error('Update failed')
      const blockedTimeId = faker.string.uuid()
      const updateData = {
        reason: 'Updated reason'
      }

      req.params.id = blockedTimeId
      req.body = updateData
      useCaseMock.executeUpdate.mockRejectedValueOnce(error)

      await BlockedTimesController.handleUpdate(req, res, next)

      expect(useCaseMock.executeUpdate).toHaveBeenCalledTimes(1)
      expect(res.status).not.toHaveBeenCalled()
      expect(res.send).not.toHaveBeenCalled()
      expect(next).toHaveBeenCalledTimes(1)
      expect(next).toHaveBeenCalledWith(error)
    })
  })

  describe('handleFindById', () => {
    it('should find blocked time by id successfully', async () => {
      const blockedTimeId = faker.string.uuid()
      const blockedTime: BlockedTime = {
        id: blockedTimeId,
        professionalId: 'user-123',
        startDate: new Date('2024-01-01T09:00:00'),
        endDate: new Date('2024-01-01T18:00:00'),
        startTime: new Date('2024-01-01T09:00:00'),
        endTime: new Date('2024-01-01T10:00:00'),
        reason: faker.lorem.sentence(),
        isActive: true,
        monday: false,
        tuesday: false,
        wednesday: false,
        thursday: false,
        friday: false,
        saturday: false,
        sunday: false,
        createdAt: faker.date.past(),
        updatedAt: faker.date.past()
      }

      req.params.id = blockedTimeId
      useCaseMock.executeFindById.mockResolvedValueOnce(blockedTime)

      await BlockedTimesController.handleFindById(req, res, next)

      expect(useCaseMock.executeFindById).toHaveBeenCalledTimes(1)
      expect(useCaseMock.executeFindById).toHaveBeenCalledWith({
        id: 'user-123',
        userType: UserType.PROFESSIONAL,
        email: 'test@example.com',
        name: 'Test User',
        registerCompleted: true,
        googleId: '',
        profilePhotoUrl: '',
        userId: 'user-123',
        permissions: [],
        extra: {
          blockedTimeId
        }
      })
      expect(res.status).toHaveBeenCalledWith(StatusCodes.OK)
      expect(res.send).toHaveBeenCalledWith(blockedTime)
      expect(next).not.toHaveBeenCalled()
    })

    it('should call next with an error if executeFindById fails', async () => {
      const error = new Error('Not found')
      const blockedTimeId = faker.string.uuid()

      req.params.id = blockedTimeId
      useCaseMock.executeFindById.mockRejectedValueOnce(error)

      await BlockedTimesController.handleFindById(req, res, next)

      expect(useCaseMock.executeFindById).toHaveBeenCalledTimes(1)
      expect(res.status).not.toHaveBeenCalled()
      expect(res.send).not.toHaveBeenCalled()
      expect(next).toHaveBeenCalledTimes(1)
      expect(next).toHaveBeenCalledWith(error)
    })
  })

  describe('handleDelete', () => {
    it('should delete blocked time successfully', async () => {
      const blockedTimeId = faker.string.uuid()

      req.params.id = blockedTimeId
      useCaseMock.executeDelete.mockResolvedValueOnce(undefined)

      await BlockedTimesController.handleDelete(req, res, next)

      expect(useCaseMock.executeDelete).toHaveBeenCalledTimes(1)
      expect(useCaseMock.executeDelete).toHaveBeenCalledWith({
        id: 'user-123',
        userType: UserType.PROFESSIONAL,
        email: 'test@example.com',
        name: 'Test User',
        registerCompleted: true,
        googleId: '',
        profilePhotoUrl: '',
        userId: 'user-123',
        permissions: [],
        extra: {
          blockedTimeId
        }
      })
      expect(res.status).toHaveBeenCalledWith(StatusCodes.OK)
      expect(res.send).toHaveBeenCalled()
      expect(next).not.toHaveBeenCalled()
    })

    it('should call next with an error if executeDelete fails', async () => {
      const error = new Error('Delete failed')
      const blockedTimeId = faker.string.uuid()

      req.params.id = blockedTimeId
      useCaseMock.executeDelete.mockRejectedValueOnce(error)

      await BlockedTimesController.handleDelete(req, res, next)

      expect(useCaseMock.executeDelete).toHaveBeenCalledTimes(1)
      expect(res.status).not.toHaveBeenCalled()
      expect(res.send).not.toHaveBeenCalled()
      expect(next).toHaveBeenCalledTimes(1)
      expect(next).toHaveBeenCalledWith(error)
    })
  })

  describe('findByProfessionalAndPeriod', () => {
    it('should find blocked times by professional and period successfully', async () => {
      const professionalId = 'prof-123'
      const blockedTimes: BlockedTime[] = [
        {
          id: faker.string.uuid(),
          professionalId,
          startDate: new Date('2024-01-10T09:00:00'),
          endDate: new Date('2024-01-10T18:00:00'),
          startTime: new Date('2024-01-10T09:00:00'),
          endTime: new Date('2024-01-10T10:00:00'),
          reason: faker.lorem.sentence(),
          isActive: true,
          monday: false,
          tuesday: false,
          wednesday: false,
          thursday: false,
          friday: false,
          saturday: false,
          sunday: false,
          createdAt: faker.date.past(),
          updatedAt: faker.date.past()
        }
      ]

      req.params.professionalId = professionalId
      req.query = { startDate: '2024-01-01', endDate: '2024-01-31' }
      useCaseMock.executeFindByProfessionalAndPeriod.mockResolvedValueOnce(blockedTimes)

      await BlockedTimesController.findByProfessionalAndPeriod(req, res, next)

      expect(useCaseMock.executeFindByProfessionalAndPeriod).toHaveBeenCalledTimes(1)
      expect(useCaseMock.executeFindByProfessionalAndPeriod).toHaveBeenCalledWith({
        professionalId,
        startDate: '2024-01-01',
        endDate: '2024-01-31'
      })
      expect(res.status).toHaveBeenCalledWith(StatusCodes.OK)
      expect(res.send).toHaveBeenCalledWith({ data: blockedTimes })
      expect(next).not.toHaveBeenCalled()
    })

    it('should call next with an error if executeFindByProfessionalAndPeriod fails', async () => {
      const error = new Error('Period exceeds maximum allowed')
      const professionalId = 'prof-123'

      req.params.professionalId = professionalId
      req.query = { startDate: '2024-01-01', endDate: '2024-03-01' }
      useCaseMock.executeFindByProfessionalAndPeriod.mockRejectedValueOnce(error)

      await BlockedTimesController.findByProfessionalAndPeriod(req, res, next)

      expect(useCaseMock.executeFindByProfessionalAndPeriod).toHaveBeenCalledTimes(1)
      expect(res.status).not.toHaveBeenCalled()
      expect(res.send).not.toHaveBeenCalled()
      expect(next).toHaveBeenCalledTimes(1)
      expect(next).toHaveBeenCalledWith(error)
    })
  })
})
