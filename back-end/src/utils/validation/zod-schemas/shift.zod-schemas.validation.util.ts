import { z } from 'zod'
import { RegexPatterns } from '../regex.validation.util'
import { WeekDays } from '@prisma/client'

class ShiftSchemas {
  public static createSchema = z.object({
    weekDay: z.nativeEnum(WeekDays),
    isBusy: z.boolean().optional(),
    shiftStart: z.string().refine((string) => RegexPatterns.time.test(string)),
    shiftEnd: z.string().refine((string) => RegexPatterns.time.test(string)),
    employeeId: z.string().uuid()
  }).strict()

  public static updateSchema = z.object({
    weekDay: z.nativeEnum(WeekDays).optional(),
    isBusy: z.boolean().optional(),
    shiftStart: z.string().refine((string) => RegexPatterns.time.test(string)).optional(),
    shiftEnd: z.string().refine((string) => RegexPatterns.time.test(string)).optional()
  }).strict()
}

export { ShiftSchemas }
