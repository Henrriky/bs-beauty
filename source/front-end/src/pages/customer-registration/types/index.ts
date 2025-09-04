import { z } from 'zod'
import { CustomerSchemas } from '../../../utils/validation/zod-schemas/customer.zod-schemas.validation.util'
import { SubmitHandler } from 'react-hook-form'

type CustomerRegistrationFormData = z.infer<
  typeof CustomerSchemas.registerCustomerBodySchema
>

type OnSubmitCustomerRegistrationFormData =
  SubmitHandler<CustomerRegistrationFormData>

export type {
  CustomerRegistrationFormData,
  OnSubmitCustomerRegistrationFormData,
}
