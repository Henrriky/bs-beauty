import { Appointment, type $Enums, type Professional } from '@prisma/client'
import { type Decimal } from '@prisma/client/runtime/library'

export interface FindAppointmentByCustomerId {
  id: string
  observation: string | null
  status: $Enums.Status
  appointmentDate: Date
  appointment: {
    customerId: string
  }
  serviceOffered: {
    id: string
    estimatedTime: number
    professional: Professional
    service: {
      name: string
    }
  }

}

export interface FindAppointmentById {
  id: string
  observation: string | null
  status: $Enums.Status
  appointmentDate: Date
  appointment: {
    customerId: string
  }
  serviceOffered: {
    id: string
    estimatedTime: number
    price: Decimal
    professional: Professional
    service: {
      name: string
    }
  }

}
