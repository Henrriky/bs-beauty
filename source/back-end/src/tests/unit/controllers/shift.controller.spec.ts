import { type Shift, UserType, WeekDays } from '@prisma/client'
import { StatusCodes } from 'http-status-codes'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { ShiftController } from '../../../controllers/shift.controller'
import { makeShiftUseCaseFactory } from '../../../factory/make-shift-use-case.factory'
import { mockRequest, type MockRequest, mockResponse } from '../utils/test-utilts'

vi.mock('../../../src/factory/make-shift-use-case.factory')

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
        userType: UserType.EMPLOYEE,
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
      executeFindAllByEmployeeId: vi.fn(),
      executeFindById: vi.fn(),
      executeFindByEmployeeId: vi.fn(),
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

  describe('handleFindAllByEmployeeId', () => {
    it('should return 200 and shifts when use case succeeds', async () => {
      // arrange
      useCaseMock.executeFindAllByEmployeeId.mockResolvedValueOnce({
        shifts: [
          {
            id: 'shift-1',
            weekDay: WeekDays.MONDAY,
            shiftStart: new Date(),
            employeeId: 'user-123'
          }
        ] as Shift[]
      })

      // act
      await ShiftController.handleFindAllByEmployeeId(req, res, next)

      // assert
      expect(useCaseMock.executeFindAllByEmployeeId).toHaveBeenCalledWith('user-123')
      expect(res.send).toHaveBeenCalledWith({
        shifts: [
          {
            id: 'shift-1',
            weekDay: WeekDays.MONDAY,
            shiftStart: new Date(),
            employeeId: 'user-123'
          }
        ]
      })
    })

    it('should call next with an error if use case throws', async () => {
      // arrange
      const error = new Error('Use case failure')
      useCaseMock.executeFindAllByEmployeeId.mockRejectedValueOnce(error)

      // act
      await ShiftController.handleFindAllByEmployeeId(req, res, next)

      // assert
      expect(next).toHaveBeenCalledWith(error)
    })
  })

  describe('handleFindById', () => {
    it('should send 200 and shift when use case succeeds', async () => {
      // arrange
      const shiftId = 'shift-1'
      req.params.id = shiftId
      useCaseMock.executeFindById.mockResolvedValueOnce({
        id: shiftId,
        weekDay: WeekDays.MONDAY,
        shiftStart: new Date(),
        employeeId: 'user-123'
      } as Shift)

      // act
      await ShiftController.handleFindById(req, res, next)

      // assert
      expect(useCaseMock.executeFindById).toHaveBeenCalledWith(shiftId)
      expect(res.send).toHaveBeenCalledWith({
        id: shiftId,
        weekDay: WeekDays.MONDAY,
        shiftStart: new Date(),
        employeeId: 'user-123'
      })
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

  describe('handleFindByEmployeeId', () => {
    it('should send 200 and shift when use case succeeds', async () => {
      // arrange
      const employeeId = 'user-123'
      req.params.id = employeeId
      useCaseMock.executeFindByEmployeeId.mockResolvedValueOnce({
        shifts: [
          {
            id: 'shift-1',
            weekDay: WeekDays.MONDAY,
            shiftStart: new Date(),
            employeeId: 'user-123'
          }
        ] as Shift[]
      })

      // act
      await ShiftController.handleFindByEmployeeId(req, res, next)

      // assert
      expect(useCaseMock.executeFindByEmployeeId).toHaveBeenCalledWith(employeeId)
      expect(next).not.toHaveBeenCalled()
      expect(res.send).toHaveBeenCalledWith({
        shifts: [
          {
            id: 'shift-1',
            weekDay: WeekDays.MONDAY,
            shiftStart: new Date(),
            employeeId: 'user-123'
          }
        ]
      })
    })

    it('should call next with an error if use case throws', async () => {
      // arrange
      const error = new Error('Use case failure')
      useCaseMock.executeFindByEmployeeId.mockRejectedValueOnce(error)

      // act
      await ShiftController.handleFindByEmployeeId(req, res, next)

      // assert
      expect(res.send).not.toHaveBeenCalled()
      expect(next).toHaveBeenCalledWith(error)
    })
  })

  describe('handleCreate', () => {
    it('should send 201 and created shift when use case succeeds', async () => {
      // arrange
      req.body = {
        weekDay: WeekDays.MONDAY,
        shiftStart: new Date(),
        employeeId: 'user-123'
      }
      useCaseMock.executeCreate.mockResolvedValueOnce({
        id: 'shift-1',
        weekDay: WeekDays.MONDAY,
        shiftStart: new Date(),
        employeeId: 'user-123'
      } as Shift)

      // act
      await ShiftController.handleCreate(req, res, next)

      // assert
      expect(res.status).toHaveBeenCalledWith(StatusCodes.CREATED)
      expect(useCaseMock.executeCreate).toHaveBeenCalledWith({
        weekDay: WeekDays.MONDAY,
        shiftStart: new Date(),
        employeeId: 'user-123'
      })
      expect(res.send).toHaveBeenCalledWith({
        id: 'shift-1',
        weekDay: WeekDays.MONDAY,
        shiftStart: new Date(),
        employeeId: 'user-123'
      })
    })

    it('should call next with an error if use case throws', async () => {
      // arrange
      const error = new Error('Use case failure')
      req.body = {
        weekDay: WeekDays.MONDAY,
        shiftStart: new Date(),
        employeeId: 'user-123'
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
      const shiftId = 'shift-1'
      req.params.id = shiftId
      req.body = {
        weekDay: WeekDays.MONDAY,
        shiftStart: new Date(),
        employeeId: 'user-123'
      }
      useCaseMock.executeUpdate.mockResolvedValueOnce({
        id: shiftId,
        weekDay: WeekDays.MONDAY,
        shiftStart: new Date('2025-01-02T07:00:00.000Z'),
        employeeId: 'user-123'
      } as Shift)

      // act
      await ShiftController.handleUpdateByIdAndEmployeeId(req, res, next)

      // assert
      expect(useCaseMock.executeUpdate).toHaveBeenCalledWith(shiftId, {
        weekDay: WeekDays.MONDAY,
        shiftStart: new Date(),
        employeeId: 'user-123'
      })
      expect(res.send).toHaveBeenCalledWith({
        id: shiftId,
        weekDay: WeekDays.MONDAY,
        shiftStart: new Date('2025-01-02T07:00:00.000Z'),
        employeeId: 'user-123'
      })
    })

    it('should call next with an error if use case throws', async () => {
      // arrange
      const error = new Error('Use case failure')
      const shiftId = 'shift-1'
      req.params.id = shiftId
      req.body = {
        weekDay: WeekDays.MONDAY,
        shiftStart: new Date(),
        employeeId: 'user-123'
      }
      useCaseMock.executeUpdate.mockRejectedValueOnce(error)

      // act
      await ShiftController.handleUpdateByIdAndEmployeeId(req, res, next)

      // assert
      expect(next).toHaveBeenCalledWith(error)
    })
  })

  describe('handleDelete', () => {
    it('should send 200 and deleted shift when use case succeeds', async () => {
      // arrange
      const shiftId = 'shift-1'
      req.params.id = shiftId

      useCaseMock.executeDelete.mockResolvedValueOnce({
        id: shiftId,
        weekDay: WeekDays.MONDAY,
        shiftStart: new Date(),
        employeeId: 'user-123'
      } as Shift)

      // act
      await ShiftController.handleDelete(req, res, next)

      // assert
      expect(useCaseMock.executeDelete).toHaveBeenCalledWith('shift-1')
      expect(res.send).toHaveBeenCalledWith({
        id: 'shift-1',
        weekDay: WeekDays.MONDAY,
        shiftStart: new Date(),
        employeeId: 'user-123'
      })
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
