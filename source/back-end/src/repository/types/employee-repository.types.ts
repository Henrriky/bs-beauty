import { type Prisma } from '@prisma/client'

interface ServicesOfferedByEmployee {
  id: string
  offers: Array<{
    id: string
    estimatedPrice: number
    price: Prisma.Decimal
    service: {
      id: string
      name: string
      description: string | null
      category: string
    }
  }>
}

export type { ServicesOfferedByEmployee }
