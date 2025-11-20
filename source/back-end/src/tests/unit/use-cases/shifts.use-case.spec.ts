/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { type Shift, type Prisma, WeekDays } from '@prisma/client'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { ShiftUseCase } from '../../../services/shifts.use-case'
import { type ShiftRepository } from '../../../repository/protocols/shift.repository'
import { RecordExistence } from '../../../utils/validation/record-existence.validation.util'

vi.mock('@/utils/validation/record-existence.validation.util')

describe('ShiftUseCase (Unit Tests)', () => {
  let shiftUseCase: ShiftUseCase
  let shiftRepositoryMock: ShiftRepository

  const mockShift: Shift = {
    id: 'shift-123',
    weekDay: WeekDays.MONDAY,
    isBusy: false,
    shiftStart: new Date('2025-01-01T08:00:00'),
    shiftEnd: new Date('2025-01-01T17:00:00'),
    professionalId: 'professional-123'
  }

  beforeEach(() => {
    vi.clearAllMocks()

    shiftRepositoryMock = {
      findAllByProfessionalId: vi.fn(),
      findById: vi.fn(),
      findByIdAndProfessionalId: vi.fn(),
      findByProfessionalId: vi.fn(),
      findByProfessionalAndWeekDay: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn()
    }

    shiftUseCase = new ShiftUseCase(shiftRepositoryMock)
  })

  describe('executeFindAllByProfessionalId', () => {
    it('should return all shifts for a professional', async () => {
      // arrange
      const professionalId = 'professional-123'
      const mockShifts: Shift[] = [mockShift]
      vi.mocked(shiftRepositoryMock.findAllByProfessionalId).mockResolvedValueOnce(mockShifts)

      // act
      const result = await shiftUseCase.executeFindAllByProfessionalId(professionalId)

      // assert
      expect(shiftRepositoryMock.findAllByProfessionalId).toHaveBeenCalledTimes(1)
      expect(shiftRepositoryMock.findAllByProfessionalId).toHaveBeenCalledWith(professionalId)
      expect(result).toEqual({ shifts: mockShifts })
    })

    it('should return empty array when no shifts found', async () => {
      // arrange
      const professionalId = 'professional-123'
      vi.mocked(shiftRepositoryMock.findAllByProfessionalId).mockResolvedValueOnce([])

      // act
      const result = await shiftUseCase.executeFindAllByProfessionalId(professionalId)

      // assert
      expect(shiftRepositoryMock.findAllByProfessionalId).toHaveBeenCalledTimes(1)
      expect(result).toEqual({ shifts: [] })
    })

    it('should handle undefined professionalId', async () => {
      // arrange
      vi.mocked(shiftRepositoryMock.findAllByProfessionalId).mockResolvedValueOnce([])

      // act
      const result = await shiftUseCase.executeFindAllByProfessionalId(undefined)

      // assert
      expect(shiftRepositoryMock.findAllByProfessionalId).toHaveBeenCalledTimes(1)
      expect(shiftRepositoryMock.findAllByProfessionalId).toHaveBeenCalledWith(undefined)
      expect(result).toEqual({ shifts: [] })
    })
  })

  describe('executeFindById', () => {
    it('should return a shift by id', async () => {
      // arrange
      const shiftId = 'shift-123'
      vi.mocked(shiftRepositoryMock.findById).mockResolvedValueOnce(mockShift)

      // act
      const result = await shiftUseCase.executeFindById(shiftId)

      // assert
      expect(shiftRepositoryMock.findById).toHaveBeenCalledTimes(1)
      expect(shiftRepositoryMock.findById).toHaveBeenCalledWith(shiftId)
      expect(RecordExistence.validateRecordExistence).toHaveBeenCalledTimes(1)
      expect(RecordExistence.validateRecordExistence).toHaveBeenCalledWith(mockShift, 'Shift')
      expect(result).toEqual(mockShift)
    })

    it('should validate record existence when shift not found', async () => {
      // arrange
      const shiftId = 'non-existent-shift'
      vi.mocked(shiftRepositoryMock.findById).mockResolvedValueOnce(null)

      // act
      await shiftUseCase.executeFindById(shiftId)

      // assert
      expect(shiftRepositoryMock.findById).toHaveBeenCalledTimes(1)
      expect(RecordExistence.validateRecordExistence).toHaveBeenCalledTimes(1)
      expect(RecordExistence.validateRecordExistence).toHaveBeenCalledWith(null, 'Shift')
    })
  })

  describe('executeFindByProfessionalId', () => {
    it('should return shifts for a professional', async () => {
      // arrange
      const professionalId = 'professional-123'
      const mockShifts: Shift[] = [mockShift]
      vi.mocked(shiftRepositoryMock.findByProfessionalId).mockResolvedValueOnce(mockShifts)

      // act
      const result = await shiftUseCase.executeFindByProfessionalId(professionalId)

      // assert
      expect(shiftRepositoryMock.findByProfessionalId).toHaveBeenCalledTimes(1)
      expect(shiftRepositoryMock.findByProfessionalId).toHaveBeenCalledWith(professionalId)
      expect(RecordExistence.validateManyRecordsExistence).toHaveBeenCalledTimes(1)
      expect(RecordExistence.validateManyRecordsExistence).toHaveBeenCalledWith(mockShifts, 'shifts')
      expect(result).toEqual({ shifts: mockShifts })
    })

    it('should validate when no shifts found for professional', async () => {
      // arrange
      const professionalId = 'professional-123'
      vi.mocked(shiftRepositoryMock.findByProfessionalId).mockResolvedValueOnce([])

      // act
      await shiftUseCase.executeFindByProfessionalId(professionalId)

      // assert
      expect(RecordExistence.validateManyRecordsExistence).toHaveBeenCalledTimes(1)
      expect(RecordExistence.validateManyRecordsExistence).toHaveBeenCalledWith([], 'shifts')
    })

    it('should handle undefined professionalId', async () => {
      // arrange
      vi.mocked(shiftRepositoryMock.findByProfessionalId).mockResolvedValueOnce([])

      // act
      await shiftUseCase.executeFindByProfessionalId(undefined)

      // assert
      expect(shiftRepositoryMock.findByProfessionalId).toHaveBeenCalledTimes(1)
      expect(shiftRepositoryMock.findByProfessionalId).toHaveBeenCalledWith(undefined)
    })
  })

  describe('executeCreate', () => {
    it('should create a new shift successfully', async () => {
      // arrange
      const shiftToCreate = {
        weekDay: WeekDays.MONDAY,
        shiftStart: new Date('2025-01-01T08:00:00'),
        shiftEnd: new Date('2025-01-01T17:00:00'),
        professionalId: 'professional-123'
      } as unknown as Prisma.ShiftCreateInput
      vi.mocked(shiftRepositoryMock.findByProfessionalAndWeekDay).mockResolvedValueOnce(null)
      vi.mocked(shiftRepositoryMock.create).mockResolvedValueOnce(mockShift)

      // act
      const result = await shiftUseCase.executeCreate(shiftToCreate)

      // assert
      expect(shiftRepositoryMock.findByProfessionalAndWeekDay).toHaveBeenCalledTimes(1)
      expect(shiftRepositoryMock.findByProfessionalAndWeekDay).toHaveBeenCalledWith('professional-123', WeekDays.MONDAY)
      expect(RecordExistence.validateRecordNonExistence).toHaveBeenCalledTimes(1)
      expect(RecordExistence.validateRecordNonExistence).toHaveBeenCalledWith(null, 'Shift')
      expect(shiftRepositoryMock.create).toHaveBeenCalledTimes(1)
      expect(shiftRepositoryMock.create).toHaveBeenCalledWith(shiftToCreate)
      expect(result).toEqual(mockShift)
    })

    it('should validate that shift does not already exist for professional and weekday', async () => {
      // arrange
      const shiftToCreate = {
        weekDay: WeekDays.MONDAY,
        shiftStart: new Date('2025-01-01T08:00:00'),
        shiftEnd: new Date('2025-01-01T17:00:00'),
        professionalId: 'professional-123'
      } as unknown as Prisma.ShiftCreateInput
      vi.mocked(shiftRepositoryMock.findByProfessionalAndWeekDay).mockResolvedValueOnce(mockShift)
      vi.mocked(shiftRepositoryMock.create).mockResolvedValueOnce(mockShift)

      // act
      await shiftUseCase.executeCreate(shiftToCreate)

      // assert
      expect(shiftRepositoryMock.findByProfessionalAndWeekDay).toHaveBeenCalledTimes(1)
      expect(RecordExistence.validateRecordNonExistence).toHaveBeenCalledTimes(1)
      expect(RecordExistence.validateRecordNonExistence).toHaveBeenCalledWith(mockShift, 'Shift')
    })
  })

  describe('executeUpdate', () => {
    it('should update a shift successfully', async () => {
      // arrange
      const shiftId = 'shift-123'
      const shiftToUpdate: Prisma.ShiftUpdateInput = {
        shiftStart: new Date('2025-01-01T09:00:00'),
        shiftEnd: new Date('2025-01-01T18:00:00'),
        professional: {
          connect: {
            id: 'professional-123'
          }
        }
      }
      const updatedShift: Shift = {
        ...mockShift,
        shiftStart: new Date('2025-01-01T09:00:00'),
        shiftEnd: new Date('2025-01-01T18:00:00')
      }
      vi.mocked(shiftRepositoryMock.findByIdAndProfessionalId).mockResolvedValueOnce(mockShift)
      vi.mocked(shiftRepositoryMock.update).mockResolvedValueOnce(updatedShift)

      // act
      const result = await shiftUseCase.executeUpdate(shiftId, shiftToUpdate)

      // assert
      expect(shiftRepositoryMock.findByIdAndProfessionalId).toHaveBeenCalledTimes(1)
      expect(shiftRepositoryMock.findByIdAndProfessionalId).toHaveBeenCalledWith(shiftId, 'professional-123')
      expect(RecordExistence.validateRecordExistence).toHaveBeenCalledTimes(1)
      expect(RecordExistence.validateRecordExistence).toHaveBeenCalledWith(mockShift, 'Shift')
      expect(shiftRepositoryMock.update).toHaveBeenCalledTimes(1)
      expect(shiftRepositoryMock.update).toHaveBeenCalledWith(shiftId, shiftToUpdate)
      expect(result).toEqual(updatedShift)
    })

    it('should update shift with new weekDay after validating uniqueness', async () => {
      // arrange
      const shiftId = 'shift-123'
      const shiftToUpdate: Prisma.ShiftUpdateInput = {
        weekDay: WeekDays.TUESDAY,
        professional: {
          connect: {
            id: 'professional-123'
          }
        }
      }
      const updatedShift: Shift = {
        ...mockShift,
        weekDay: WeekDays.TUESDAY
      }
      vi.mocked(shiftRepositoryMock.findByIdAndProfessionalId).mockResolvedValueOnce(mockShift)
      vi.mocked(shiftRepositoryMock.findByProfessionalAndWeekDay).mockResolvedValueOnce(null)
      vi.mocked(shiftRepositoryMock.update).mockResolvedValueOnce(updatedShift)

      // act
      const result = await shiftUseCase.executeUpdate(shiftId, shiftToUpdate)

      // assert
      expect(shiftRepositoryMock.findByProfessionalAndWeekDay).toHaveBeenCalledTimes(1)
      expect(shiftRepositoryMock.findByProfessionalAndWeekDay).toHaveBeenCalledWith('professional-123', WeekDays.TUESDAY)
      expect(RecordExistence.validateRecordNonExistence).toHaveBeenCalledTimes(1)
      expect(RecordExistence.validateRecordNonExistence).toHaveBeenCalledWith(null, 'Shift')
      expect(shiftRepositoryMock.update).toHaveBeenCalledTimes(1)
      expect(result).toEqual(updatedShift)
    })

    it('should validate that new weekDay does not conflict with existing shift', async () => {
      // arrange
      const shiftId = 'shift-123'
      const conflictingShift: Shift = {
        ...mockShift,
        id: 'shift-456',
        weekDay: WeekDays.TUESDAY
      }
      const shiftToUpdate: Prisma.ShiftUpdateInput = {
        weekDay: WeekDays.TUESDAY,
        professional: {
          connect: {
            id: 'professional-123'
          }
        }
      }
      const updatedShift: Shift = {
        ...mockShift,
        weekDay: WeekDays.TUESDAY
      }
      vi.mocked(shiftRepositoryMock.findByIdAndProfessionalId).mockResolvedValueOnce(mockShift)
      vi.mocked(shiftRepositoryMock.findByProfessionalAndWeekDay).mockResolvedValueOnce(conflictingShift)
      vi.mocked(shiftRepositoryMock.update).mockResolvedValueOnce(updatedShift)

      // act
      await shiftUseCase.executeUpdate(shiftId, shiftToUpdate)

      // assert
      expect(shiftRepositoryMock.findByProfessionalAndWeekDay).toHaveBeenCalledTimes(1)
      expect(RecordExistence.validateRecordNonExistence).toHaveBeenCalledTimes(1)
      expect(RecordExistence.validateRecordNonExistence).toHaveBeenCalledWith(conflictingShift, 'Shift')
    })

    it('should update shift without checking weekDay when weekDay is not changed', async () => {
      // arrange
      const shiftId = 'shift-123'
      const shiftToUpdate: Prisma.ShiftUpdateInput = {
        shiftStart: new Date('2025-01-01T10:00:00'),
        professional: {
          connect: {
            id: 'professional-123'
          }
        }
      }
      const updatedShift: Shift = {
        ...mockShift,
        shiftStart: new Date('2025-01-01T10:00:00')
      }
      vi.mocked(shiftRepositoryMock.findByIdAndProfessionalId).mockResolvedValueOnce(mockShift)
      vi.mocked(shiftRepositoryMock.update).mockResolvedValueOnce(updatedShift)

      // act
      const result = await shiftUseCase.executeUpdate(shiftId, shiftToUpdate)

      // assert
      expect(shiftRepositoryMock.findByProfessionalAndWeekDay).not.toHaveBeenCalled()
      expect(shiftRepositoryMock.update).toHaveBeenCalledTimes(1)
      expect(result).toEqual(updatedShift)
    })
  })

  describe('executeDelete', () => {
    it('should delete a shift successfully', async () => {
      // arrange
      const shiftId = 'shift-123'
      vi.mocked(shiftRepositoryMock.findById).mockResolvedValueOnce(mockShift)
      vi.mocked(shiftRepositoryMock.delete).mockResolvedValueOnce(mockShift)

      // act
      const result = await shiftUseCase.executeDelete(shiftId)

      // assert
      expect(shiftRepositoryMock.findById).toHaveBeenCalledTimes(1)
      expect(shiftRepositoryMock.findById).toHaveBeenCalledWith(shiftId)
      expect(RecordExistence.validateRecordExistence).toHaveBeenCalledTimes(1)
      expect(RecordExistence.validateRecordExistence).toHaveBeenCalledWith(mockShift, 'Shift')
      expect(shiftRepositoryMock.delete).toHaveBeenCalledTimes(1)
      expect(shiftRepositoryMock.delete).toHaveBeenCalledWith(shiftId)
      expect(result).toEqual(mockShift)
    })

    it('should validate shift exists before deleting', async () => {
      // arrange
      const shiftId = 'non-existent-shift'
      vi.mocked(shiftRepositoryMock.findById).mockResolvedValueOnce(null)
      vi.mocked(shiftRepositoryMock.delete).mockResolvedValueOnce(mockShift)

      // act
      await shiftUseCase.executeDelete(shiftId)

      // assert
      expect(shiftRepositoryMock.findById).toHaveBeenCalledTimes(1)
      expect(RecordExistence.validateRecordExistence).toHaveBeenCalledTimes(1)
      expect(RecordExistence.validateRecordExistence).toHaveBeenCalledWith(null, 'Shift')
    })
  })

  describe('executeFindByIdAndProfessionalId', () => {
    it('should return a shift by id and professionalId', async () => {
      // arrange
      const shiftId = 'shift-123'
      const professionalId = 'professional-123'
      vi.mocked(shiftRepositoryMock.findByIdAndProfessionalId).mockResolvedValueOnce(mockShift)

      // act
      const result = await shiftUseCase.executeFindByIdAndProfessionalId(shiftId, professionalId)

      // assert
      expect(shiftRepositoryMock.findByIdAndProfessionalId).toHaveBeenCalledTimes(1)
      expect(shiftRepositoryMock.findByIdAndProfessionalId).toHaveBeenCalledWith(shiftId, professionalId)
      expect(RecordExistence.validateRecordExistence).toHaveBeenCalledTimes(1)
      expect(RecordExistence.validateRecordExistence).toHaveBeenCalledWith(mockShift, 'Shift')
      expect(result).toEqual(mockShift)
    })

    it('should validate shift exists for given professional', async () => {
      // arrange
      const shiftId = 'shift-123'
      const professionalId = 'wrong-professional'
      vi.mocked(shiftRepositoryMock.findByIdAndProfessionalId).mockResolvedValueOnce(null)

      // act
      await shiftUseCase.executeFindByIdAndProfessionalId(shiftId, professionalId)

      // assert
      expect(RecordExistence.validateRecordExistence).toHaveBeenCalledTimes(1)
      expect(RecordExistence.validateRecordExistence).toHaveBeenCalledWith(null, 'Shift')
    })
  })
})
