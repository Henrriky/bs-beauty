import { type $Enums, type Prisma } from '@prisma/client'

interface FetchAvailableSchedulingToOfferByDay {
  id: string
  estimatedTime: number
  price: Prisma.Decimal
  isOffering: boolean
  appointments: Array<{
    id: string
    observation: string | null
    status: $Enums.Status
    appointmentDate: Date
    appointmentId: string
    serviceOfferedId: string
  }>
}
export type { FetchAvailableSchedulingToOfferByDay }
