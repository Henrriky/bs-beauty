import { z } from 'zod'
import { AppointmentSchemas } from '../../../utils/validation/zod-schemas/appointment.zod-schemas.validation.utils'
import { FindAppointmentById } from '../../../store/appointment/types'

export type ListAppointmentsButtonStatus = 'finished' | 'schedulled'

export type AppointmentDetailsAction = 'view' | 'edit'

export type CustomerUpdateAppointmentFormData = z.infer<
  typeof AppointmentSchemas.customerUpdateSchema
>

export type EmployeeUpdateAppointmentFormData = z.infer<
  typeof AppointmentSchemas.employeeUpdateSchema
>

export type OnSubmitAppointmentDetailsUpdateForm = (
  data: EmployeeUpdateAppointmentFormData | CustomerUpdateAppointmentFormData,
) => Promise<void>

export interface AppointmentDetailsComponentProps {
  action: AppointmentDetailsAction
  appointment: FindAppointmentById
  handleSubmitConcrete: OnSubmitAppointmentDetailsUpdateForm
  handleSubmitConcreteIsLoading: boolean
}
