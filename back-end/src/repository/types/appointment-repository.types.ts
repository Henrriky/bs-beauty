import { type $Enums, type Employee } from '@prisma/client'

export interface FindAppointmentServiceByCustomerId {
  id: string
  observation: string | null
  status: $Enums.Status
  appointmentDate: Date
  serviceOffered: {
    id: string
    estimatedTime: number
    employee: Employee
    service: {
      name: string
    }
  }

}
