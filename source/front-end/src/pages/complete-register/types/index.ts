import { z } from 'zod'
import { CustomerSchemas } from '../../../utils/validation/zod-schemas/customer.zod-schemas.validation.util'
import { ProfessionalSchemas } from '../../../utils/validation/zod-schemas/professional.zod-schemas.validation.utils'

type CustomerCompleteRegisterFormData = z.infer<
  typeof CustomerSchemas.customerCompleteRegisterBodySchema
>

type ProfessionalCompleteRegisterFormData = z.infer<
  typeof ProfessionalSchemas.professionalUpdateSchema
>

type OnSubmitProfessionalOrCustomerForm = (
  data: CustomerCompleteRegisterFormData | ProfessionalCompleteRegisterFormData,
) => Promise<void>

export type {
  CustomerCompleteRegisterFormData,
  ProfessionalCompleteRegisterFormData,
  OnSubmitProfessionalOrCustomerForm,
}
