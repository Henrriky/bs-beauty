import { Status } from "@prisma/client"

export interface AppointmentFilters {
  from?: Date
  to?: Date
  status?: Status[]
}
