/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { type Shift, UserType, WeekDays } from '@prisma/client'
import { StatusCodes } from 'http-status-codes'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { ShiftController } from '../../../controllers/shift.controller'
import { makeShiftUseCaseFactory } from '../../../factory/make-shift-use-case.factory'
import { mockRequest, type MockRequest, mockResponse } from '../utils/test-utilts'

vi.mock('@/factory/make-shift-use-case.factory')

describe('ShiftController', () => {
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
        email: '',
        name: '',
        registerCompleted: true,
        googleId: '',
        profilePhotoUrl: '',
        userId: 'user-123'
      }
    })

    res = mockResponse()

    next = vi.fn()

    useCaseMock = {
      executeFindAllByProfessionalId: vi.fn(),
      executeFindById: vi.fn(),
      executeFindByProfessionalId: vi.fn(),
      executeCreate: vi.fn(),
      executeUpdate: vi.fn(),
      executeDelete: vi.fn()
    }

    vi.mocked(makeShiftUseCaseFactory).mockReturnValue(useCaseMock)
    vi.setSystemTime(new Date('2025-01-01T09:00:00'))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should be defined', () => {
    expect(ShiftController).toBeDefined()
  })

  describe('handleFindAllByProfessionalId', () => {
    it('should return 200 and shifts when use case succeeds', async () => {
      // arrange
      useCaseMock.executeFindAllByProfessionalId.mockResolvedValueOnce({
        shifts: [
          {
            id: 'shift-1',
            weekDay: WeekDays.MONDAY,
            shiftStart: new Date(),
            professionalId: 'user-123'
          }
        ] as Shift[]
      })

      // act
      await ShiftController.handleFindAllByProfessionalId(req, res, next)

      // assert
      expect(useCaseMock.executeFindAllByProfessionalId).toHaveBeenCalledWith('user-123')
      expect(res.send).toHaveBeenCalledWith({
        shifts: [
          {
            id: 'shift-1',
            weekDay: WeekDays.MONDAY,
            shiftStart: new Date(),
            professionalId: 'user-123'
          }
        ]
      })
    })

    it('should call next with an error if use case throws', async () => {
      // arrange
      const error = new Error('Use case failure')
      useCaseMock.executeFindAllByProfessionalId.mockRejectedValueOnce(error)

      // act
      await ShiftController.handleFindAllByProfessionalId(req, res, next)

      // assert
      expect(next).toHaveBeenCalledWith(error)
    })
  })

  describe('handleFindById', () => {
    it('should send 200 and shift when use case succeeds', async () => {
      // arrange
      const expectedShiftId = 'shift-1'
      const expectedShift: Shift = {
        id: expectedShiftId,
        weekDay: WeekDays.MONDAY,
        shiftStart: new Date(),
        professionalId: 'user-123',
        isBusy: false,
        shiftEnd: new Date()
      }
      req.params.id = expectedShiftId
      useCaseMock.executeFindById.mockResolvedValueOnce(expectedShift)

      // act
      await ShiftController.handleFindById(req, res, next)

      // assert
      expect(useCaseMock.executeFindById).toHaveBeenCalledWith(expectedShiftId)
      expect(res.send).toHaveBeenCalledWith(expectedShift)
    })

    it('should call next with an error if use case throws', async () => {
      // arrange
      const error = new Error('Use case failure')
      useCaseMock.executeFindById.mockRejectedValueOnce(error)

      // act
      await ShiftController.handleFindById(req, res, next)

      // assert
      expect(next).toHaveBeenCalledWith(error)
    })
  })

  describe('handleFindByProfessionalId', () => {
    it('should send 200 and shift when use case succeeds', async () => {
      // arrange
      const professionalId = 'user-123'
      req.params.id = professionalId
      useCaseMock.executeFindByProfessionalId.mockResolvedValueOnce({
        shifts: [
          {
            id: 'shift-1',
            weekDay: WeekDays.MONDAY,
            shiftStart: new Date(),
            professionalId: 'user-123'
          }
        ] as Shift[]
      })

      // act
      await ShiftController.handleFindByProfessionalId(req, res, next)

      // assert
      expect(useCaseMock.executeFindByProfessionalId).toHaveBeenCalledWith(professionalId)
      expect(next).not.toHaveBeenCalled()
      expect(res.send).toHaveBeenCalledWith({
        shifts: [
          {
            id: 'shift-1',
            weekDay: WeekDays.MONDAY,
            shiftStart: new Date(),
            professionalId: 'user-123'
          }
        ]
      })
    })

    it('should call next with an error if use case throws', async () => {
      // arrange
      const error = new Error('Use case failure')
      useCaseMock.executeFindByProfessionalId.mockRejectedValueOnce(error)

      // act
      await ShiftController.handleFindByProfessionalId(req, res, next)

      // assert
      expect(res.send).not.toHaveBeenCalled()
      expect(next).toHaveBeenCalledWith(error)
    })
  })

  describe('handleCreate', () => {
    it('should send 201 and created shift when use case succeeds', async () => {
      // arrange
      const expectedCreatedShift: Shift = {
        id: 'shift-1',
        weekDay: WeekDays.MONDAY,
        shiftStart: new Date(),
        professionalId: 'user-123',
        isBusy: false,
        shiftEnd: new Date()
      }
      const shiftToCreate = {
        weekDay: expectedCreatedShift.weekDay,
        shiftStart: expectedCreatedShift.shiftStart,
        professionalId: expectedCreatedShift.professionalId
      }
      req.body = shiftToCreate
      useCaseMock.executeCreate.mockResolvedValueOnce(expectedCreatedShift)

      // act
      await ShiftController.handleCreate(req, res, next)

      // assert
      expect(res.status).toHaveBeenCalledWith(StatusCodes.CREATED)
      expect(useCaseMock.executeCreate).toHaveBeenCalledWith(shiftToCreate)
      expect(res.send).toHaveBeenCalledWith(expectedCreatedShift)
    })

    it('should call next with an error if use case throws', async () => {
      // arrange
      const error = new Error('Use case failure')
      req.body = {
        weekDay: WeekDays.MONDAY,
        shiftStart: new Date(),
        professionalId: 'user-123'
      }
      useCaseMock.executeCreate.mockRejectedValueOnce(error)

      // act
      await ShiftController.handleCreate(req, res, next)

      // assert
      expect(next).toHaveBeenCalledWith(error)
    })
  })

  describe('handleUpdate', () => {
    it('should send 200 and updated shift when use case succeeds', async () => {
      // arrange
      const shiftId = 'sla-teste'
      const start = new Date('2025-01-02T07:00:00.000Z')
      const end = new Date('2025-01-01T12:00:00.000Z')

      const shiftToUpdate = {
        weekDay: WeekDays.MONDAY,
        shiftStart: start,
        professionalId: 'user-123'
      }
      const expectedShiftUpdated: Shift = {
        id: shiftId,
        weekDay: shiftToUpdate.weekDay,
        professionalId: shiftToUpdate.professionalId,
        isBusy: false,
        shiftStart: start,
        shiftEnd: end
      }
      req.body = shiftToUpdate
      req.params.id = shiftId
      useCaseMock.executeUpdate.mockResolvedValueOnce(expectedShiftUpdated)

      // act
      await ShiftController.handleUpdateByIdAndProfessionalId(req, res, next)

      // assert
      expect(useCaseMock.executeUpdate).toHaveBeenCalledWith(shiftId, shiftToUpdate)
      expect(res.send).toHaveBeenCalledWith(expectedShiftUpdated)
    })

    it('should call next with an error if use case throws', async () => {
      // arrange
      const error = new Error('Use case failure')
      const shiftId = 'shift-1'
      req.params.id = shiftId
      req.body = {
        weekDay: WeekDays.MONDAY,
        shiftStart: new Date(),
        professionalId: 'user-123'
      }
      useCaseMock.executeUpdate.mockRejectedValueOnce(error)

      // act
      await ShiftController.handleUpdateByIdAndProfessionalId(req, res, next)

      // assert
      expect(next).toHaveBeenCalledWith(error)
    })
  })

  describe('handleDelete', () => {
    it('should send 200 and deleted shift when use case succeeds', async () => {
      // arrange
      const shiftIdToDelete = 'shift-1'
      const deletedShift: Shift = {
        id: shiftIdToDelete,
        weekDay: WeekDays.MONDAY,
        shiftStart: new Date(),
        professionalId: 'user-123',
        isBusy: false,
        shiftEnd: new Date()
      }
      req.params.id = shiftIdToDelete
      useCaseMock.executeDelete.mockResolvedValueOnce(deletedShift)

      // act
      await ShiftController.handleDelete(req, res, next)

      // assert
      expect(useCaseMock.executeDelete).toHaveBeenCalledWith('shift-1')
      expect(res.send).toHaveBeenCalledWith(deletedShift)
    })

    it('should call next with an error if use case throws', async () => {
      // arrange
      const error = new Error('Use case failure')
      const shiftId = 'shift-1'
      req.params.id = shiftId

      useCaseMock.executeDelete.mockRejectedValueOnce(error)

      // act
      await ShiftController.handleDelete(req, res, next)

      // assert
      expect(next).toHaveBeenCalledWith(error)
    })
  })
})
