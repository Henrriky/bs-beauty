import { z } from 'zod'
import { AppointmentServiceSchemas } from '../../../utils/validation/zod-schemas/appointment-service.zod-schemas.validation.util'
import { FindAppointmentServiceById } from '../../../store/appointment/types'

export type ListAppointmentsButtonStatus = 'finished' | 'schedulled'

export type AppointmentDetailsAction = 'view' | 'edit'

export type CustomerUpdateAppointmentFormData = z.infer<
  typeof AppointmentServiceSchemas.customerUpdateSchema
>

export type EmployeeUpdateAppointmentFormData = z.infer<
  typeof AppointmentServiceSchemas.employeeUpdateSchema
>

export type OnSubmitAppointmentDetailsUpdateForm = (
  data: EmployeeUpdateAppointmentFormData | CustomerUpdateAppointmentFormData,
) => Promise<void>

export interface AppointmentDetailsComponentProps {
  action: AppointmentDetailsAction
  appointmentService: FindAppointmentServiceById
  handleSubmitConcrete: OnSubmitAppointmentDetailsUpdateForm
  handleSubmitConcreteIsLoading: boolean
}
