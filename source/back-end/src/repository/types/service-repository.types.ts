import { type Prisma } from '@prisma/client'

interface ProfessionalsOfferingService {
  id: string
  offers: Array<{
    id: string
    estimatedTime: number
    price: Prisma.Decimal
    professional: {
      id: string
      name: string | null
      specialization: string | null
      profilePhotoUrl: string | null
      paymentMethods: { name: string }[]
    }
  }>
}

export type { ProfessionalsOfferingService }
