import { z } from 'zod'
import { AppointmentSchemas } from '../../../../../../utils/validation/zod-schemas/appointment.zod-schemas.validation.utils'
import { ProfessionalSchemas } from '../../../../../../utils/validation/zod-schemas/professional.zod-schemas.validation.utils'

const professionalAtribbutes =
  ProfessionalSchemas.professionalUpdateSchema.pick({
    name: true,
    paymentMethods: true,
  })

export const appointmentFormData = AppointmentSchemas.createSchemaForm
  .merge(professionalAtribbutes)
  .extend({
    professionalPhotoUrl: z.string(),
    estimatedTime: z.number(),
    price: z.number(),
  })

type CreateAppointmentFormData = z.infer<typeof appointmentFormData>

export type { CreateAppointmentFormData }
