import { type Prisma } from '@prisma/client'

interface ServicesOfferedByProfessional {
  id: string
  offers: Array<{
    id: string
    estimatedTime: number
    price: Prisma.Decimal
    service: {
      id: string
      name: string
      description: string | null
      category: string
    }
  }>
}

export type { ServicesOfferedByProfessional }
