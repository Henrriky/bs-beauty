import { type WeekDays, type Prisma, type Shift } from '@prisma/client'

interface ShiftRepository {
  findAllByProfessionalId: (professionalId: string | undefined) => Promise<Shift[]>
  findById: (id: string) => Promise<Shift | null>
  findByIdAndProfessionalId: (id: string, professionalId: string) => Promise<Shift | null>
  findByProfessionalId: (professionalId: string | undefined) => Promise<Shift[]>
  findByProfessionalAndWeekDay: (professionalId: string, weekDay: WeekDays) => Promise<Shift | null>
  create: (shift: Prisma.ShiftCreateInput) => Promise<Shift>
  update: (id: string, shift: Prisma.ShiftUpdateInput) => Promise<Shift>
  delete: (id: string) => Promise<Shift>
}

export type { ShiftRepository }
