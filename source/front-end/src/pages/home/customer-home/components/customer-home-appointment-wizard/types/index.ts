import { z } from 'zod'
import { AppointmentSchemas } from '../../../../../../utils/validation/zod-schemas/appointment.zod-schemas.validation.utils'

type CreateAppointmentFormData = z.infer<
  typeof AppointmentSchemas.createSchemaForm
>

export type { CreateAppointmentFormData }
