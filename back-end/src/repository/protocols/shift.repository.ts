import { type WeekDays, type Prisma, type Shift } from '@prisma/client'

interface ShiftRepository {
  findAllByEmployeeId: (employeeId: string | undefined) => Promise<Shift[]>
  findById: (id: string) => Promise<Shift | null>
  findByIdAndEmployeeId: (id: string, employeeId: string) => Promise<Shift | null>
  findByEmployeeId: (employeeId: string | undefined) => Promise<Shift[]>
  findByEmployeeAndWeekDay: (employeeId: string, weekDay: WeekDays) => Promise<Shift | null>
  create: (shift: Prisma.ShiftCreateInput) => Promise<Shift>
  update: (id: string, shift: Prisma.ShiftUpdateInput) => Promise<Shift>
  delete: (id: string) => Promise<Shift>
}

export type { ShiftRepository }
