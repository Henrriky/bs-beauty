import { describe, expect, it } from 'vitest'
import { DateFormatter } from '@/utils/formatting/date.formatting.util'
import { WeekDays } from '@prisma/client'
import type { Request } from 'express'

describe('DateFormatter', () => {
  describe('formatBirthdate', () => {
    it('should format birthdate from request body', () => {
      const req = {
        body: {
          birthdate: '1990-05-15T00:00:00.000Z'
        }
      } as Request

      const result = DateFormatter.formatBirthdate(req)

      expect(result).toBeInstanceOf(Date)
      expect(result.getUTCFullYear()).toBe(1990)
      expect(result.getUTCMonth()).toBe(4) // May is month 4 (0-indexed)
      // Date can be 14 or 15 depending on timezone adjustment
      expect([14, 15]).toContain(result.getUTCDate())
    })
  })

  describe('formatBirthday', () => {
    it('should format birthday with default pattern', () => {
      const birthdate = new Date('1990-12-25T00:00:00.000Z')
      const result = DateFormatter.formatBirthday(birthdate)

      expect(result).toMatch(/\d{2}\/\d{2}/)
    })

    it('should format birthday with custom pattern', () => {
      const birthdate = new Date('1990-12-25T00:00:00.000Z')
      const result = DateFormatter.formatBirthday(birthdate, 'dd/LL/yyyy')

      expect(result).toMatch(/\d{2}\/\d{2}\/\d{4}/)
    })

    it('should return empty string for null birthdate', () => {
      const result = DateFormatter.formatBirthday(null)

      expect(result).toBe('')
    })

    it('should return empty string for undefined birthdate', () => {
      const result = DateFormatter.formatBirthday(undefined)

      expect(result).toBe('')
    })

    it('should format with different patterns', () => {
      const birthdate = new Date('1990-06-15T00:00:00.000Z')

      const ddLL = DateFormatter.formatBirthday(birthdate, 'dd/LL')
      expect(ddLL).toBe('15/06')

      const ddLLyyyy = DateFormatter.formatBirthday(birthdate, 'dd/LL/yyyy')
      expect(ddLLyyyy).toBe('15/06/1990')
    })
  })

  describe('formatAppointmentDate', () => {
    it('should format appointment date from request body', () => {
      const req = {
        body: {
          appointmentDate: '2024-03-15T14:30:00.000Z'
        }
      } as Request

      const result = DateFormatter.formatAppointmentDate(req)

      expect(result).toBeInstanceOf(Date)
    })
  })

  describe('formatShiftStart', () => {
    it('should format shift start time from string', () => {
      const req = {
        body: {
          shiftStart: '08:30'
        }
      } as Request

      const result = DateFormatter.formatShiftStart(req)

      expect(result).toBeInstanceOf(Date)
    })

    it('should return current date if shiftStart is not a string', () => {
      const req = {
        body: {
          shiftStart: null
        }
      } as Request

      const result = DateFormatter.formatShiftStart(req)

      expect(result).toBeInstanceOf(Date)
    })
  })

  describe('formatShiftEnd', () => {
    it('should format shift end time from string', () => {
      const req = {
        body: {
          shiftEnd: '17:00'
        }
      } as Request

      const result = DateFormatter.formatShiftEnd(req)

      expect(result).toBeInstanceOf(Date)
    })

    it('should return current date if shiftEnd is not a string', () => {
      const req = {
        body: {
          shiftEnd: null
        }
      } as Request

      const result = DateFormatter.formatShiftEnd(req)

      expect(result).toBeInstanceOf(Date)
    })
  })

  describe('formatDayOfDateToWeekDay', () => {
    it('should convert Sunday to SUNDAY', () => {
      const date = new Date(2024, 2, 17) // March 17, 2024 - Sunday in local time
      const result = DateFormatter.formatDayOfDateToWeekDay(date)

      expect(result).toBe(WeekDays.SUNDAY)
    })

    it('should convert Monday to MONDAY', () => {
      const date = new Date(2024, 2, 18) // March 18, 2024 - Monday
      const result = DateFormatter.formatDayOfDateToWeekDay(date)

      expect(result).toBe(WeekDays.MONDAY)
    })

    it('should convert Tuesday to TUESDAY', () => {
      const date = new Date(2024, 2, 19) // March 19, 2024 - Tuesday
      const result = DateFormatter.formatDayOfDateToWeekDay(date)

      expect(result).toBe(WeekDays.TUESDAY)
    })

    it('should convert Wednesday to WEDNESDAY', () => {
      const date = new Date(2024, 2, 20) // March 20, 2024 - Wednesday
      const result = DateFormatter.formatDayOfDateToWeekDay(date)

      expect(result).toBe(WeekDays.WEDNESDAY)
    })

    it('should convert Thursday to THURSDAY', () => {
      const date = new Date(2024, 2, 21) // March 21, 2024 - Thursday
      const result = DateFormatter.formatDayOfDateToWeekDay(date)

      expect(result).toBe(WeekDays.THURSDAY)
    })

    it('should convert Friday to FRIDAY', () => {
      const date = new Date(2024, 2, 22) // March 22, 2024 - Friday
      const result = DateFormatter.formatDayOfDateToWeekDay(date)

      expect(result).toBe(WeekDays.FRIDAY)
    })

    it('should convert Saturday to SATURDAY', () => {
      const date = new Date(2024, 2, 23) // March 23, 2024 - Saturday
      const result = DateFormatter.formatDayOfDateToWeekDay(date)

      expect(result).toBe(WeekDays.SATURDAY)
    })
  })

  describe('formatDateToLocaleString', () => {
    it('should format date to locale string', () => {
      const date = new Date('2024-03-15T14:30:00.000Z')
      const result = DateFormatter.formatDateToLocaleString(date)

      expect(result).toMatch(/\d{2}\/\d{2}\/\d{4} - \d{2}:\d{2}/)
    })

    it('should return empty string for invalid date', () => {
      const invalidDate = new Date('invalid')
      const result = DateFormatter.formatDateToLocaleString(invalidDate)

      expect(result).toBe('')
    })

    it('should return empty string for null date', () => {
      const result = DateFormatter.formatDateToLocaleString(null as any)

      expect(result).toBe('')
    })

    it('should return empty string for undefined date', () => {
      const result = DateFormatter.formatDateToLocaleString(undefined as any)

      expect(result).toBe('')
    })
  })
})
