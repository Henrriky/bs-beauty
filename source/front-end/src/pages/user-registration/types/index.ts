import { z } from 'zod'
import { CustomerSchemas } from '../../../utils/validation/zod-schemas/customer.zod-schemas.validation.util'
import { SubmitHandler } from 'react-hook-form'
import { ProfessionalSchemas } from '../../../utils/validation/zod-schemas/professional.zod-schemas.validation.utils'

type CustomerRegistrationFormData = z.infer<
  typeof CustomerSchemas.registerCustomerBodySchema
>

type ProfessionalRegistrationFormData = z.infer<
  typeof ProfessionalSchemas.registerProfessionalBodySchema
>

type OnSubmitCustomerRegistrationFormData =
  SubmitHandler<CustomerRegistrationFormData>

type OnSubmitProfessionalRegistrationFormData =
  SubmitHandler<ProfessionalRegistrationFormData>

export type {
  CustomerRegistrationFormData,
  OnSubmitCustomerRegistrationFormData,
  ProfessionalRegistrationFormData,
  OnSubmitProfessionalRegistrationFormData,
}
