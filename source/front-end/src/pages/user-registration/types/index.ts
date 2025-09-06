import { z } from 'zod'
import { CustomerSchemas } from '../../../utils/validation/zod-schemas/customer.zod-schemas.validation.util'
import { SubmitHandler } from 'react-hook-form'
import { EmployeeSchemas } from '../../../utils/validation/zod-schemas/employee.zod-schemas.validation.utils'

type CustomerRegistrationFormData = z.infer<
  typeof CustomerSchemas.registerCustomerBodySchema
>

type EmployeeRegistrationFormData = z.infer<
  typeof EmployeeSchemas.registerEmployeeBodySchema
>

type OnSubmitCustomerRegistrationFormData =
  SubmitHandler<CustomerRegistrationFormData>

type OnSubmitEmployeeRegistrationFormData =
  SubmitHandler<EmployeeRegistrationFormData>

export type {
  CustomerRegistrationFormData,
  OnSubmitCustomerRegistrationFormData,
  EmployeeRegistrationFormData,
  OnSubmitEmployeeRegistrationFormData,
}
