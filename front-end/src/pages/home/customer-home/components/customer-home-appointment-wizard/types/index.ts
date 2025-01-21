import { z } from 'zod'
import { AppointmentServiceSchemas } from '../../../../../../utils/validation/zod-schemas/appointment-service.zod-schemas.validation.util'

type CreateAppointmentFormData = z.infer<
  typeof AppointmentServiceSchemas.createSchema
> & {
  employeeId: string | null
  appointmentDayPicked: Date | null
}

export type { CreateAppointmentFormData }
