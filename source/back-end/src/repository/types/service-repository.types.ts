import { type Prisma } from '@prisma/client'

interface EmployeesOfferingService {
  id: string
  offers: Array<{
    id: string
    estimatedTime: number
    price: Prisma.Decimal
    employee: {
      id: string
      name: string | null
      specialization: string | null
      profilePhotoUrl: string | null
    }
  }>
}

export type { EmployeesOfferingService }
