import { z } from 'zod'
import { AppointmentServiceSchemas } from '../../../../../../utils/validation/zod-schemas/appointment-service.zod-schemas.validation.util'

type CreateAppointmentFormData = z.infer<
  typeof AppointmentServiceSchemas.createSchema
>

export type { CreateAppointmentFormData }
