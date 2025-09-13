import { z } from 'zod'
import { AppointmentSchemas } from '../../../../../../utils/validation/zod-schemas/appointment.zod-schemas.validation.utils'
import { OfferSchemas } from '../../../../../../utils/validation/zod-schemas/offer.zod-schemas.validation.utils'
import { ProfessionalSchemas } from '../../../../../../utils/validation/zod-schemas/professional.zod-schemas.validation.utils'

const offerAtribbutes = OfferSchemas.createSchema.pick({
  estimatedTime: true,
  price: true,
})

const professionalAtribbutes =
  ProfessionalSchemas.professionalUpdateSchema.pick({
    name: true,
    paymentMethods: true,
  })

export const appointmentFormData = AppointmentSchemas.createSchemaForm
  .merge(offerAtribbutes)
  .merge(professionalAtribbutes)
  .extend({
    professionalPhotoUrl: z.string(),
  })

type CreateAppointmentFormData = z.infer<typeof appointmentFormData>

export type { CreateAppointmentFormData }
