import { Appointment, type $Enums, type Employee } from '@prisma/client'
import { Decimal } from '@prisma/client/runtime/library'

export interface FindAppointmentServiceByCustomerId {
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
    employee: Employee
    service: {
      name: string
    }
  }

}

export interface FindAppointmentServiceById {
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
    employee: Employee
    service: {
      name: string
    }
  }

}
