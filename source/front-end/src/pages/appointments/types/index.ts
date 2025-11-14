import { z } from 'zod'
import { AppointmentSchemas } from '../../../utils/validation/zod-schemas/appointment.zod-schemas.validation.utils'
import { FindAppointmentById } from '../../../store/appointment/types'
import { RatingSchemas } from '../../../utils/validation/zod-schemas/rating.zod-schemas.validation.utils'

export type ListAppointmentsButtonStatus = 'finished' | 'schedulled'

export type AppointmentDetailsAction = 'view' | 'edit'

export type CustomerUpdateAppointmentFormData = z.infer<
  typeof AppointmentSchemas.customerUpdateSchema
>

export type ProfessionalUpdateAppointmentFormData = z.infer<
  typeof AppointmentSchemas.professionalUpdateSchema
>

export type RatingUpdateFormData = z.infer<
  typeof RatingSchemas.ratingUpdateSchema
>

export type OnSubmitAppointmentDetailsUpdateForm = (
  data:
    | ProfessionalUpdateAppointmentFormData
    | CustomerUpdateAppointmentFormData,
) => Promise<void>

export interface AppointmentDetailsComponentProps {
  action: AppointmentDetailsAction
  appointment: FindAppointmentById
  handleSubmitConcrete: OnSubmitAppointmentDetailsUpdateForm
  handleSubmitConcreteIsLoading: boolean
}
