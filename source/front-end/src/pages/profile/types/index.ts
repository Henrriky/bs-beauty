import { z } from 'zod'
import { CustomerSchemas } from '../../../utils/validation/zod-schemas/customer.zod-schemas.validation.util'
import { ProfessionalSchemas } from '../../../utils/validation/zod-schemas/professional.zod-schemas.validation.utils'

type CustomerUpdateProfileFormData = z.infer<
  typeof CustomerSchemas.updateSchema
>

type ProfessionalUpdateProfileFormData = z.infer<
  typeof ProfessionalSchemas.professionalUpdateSchema
>

type ManagerUpdateProfileFormData = z.infer<
  typeof ProfessionalSchemas.managerUpdateSchema
>

export type {
  CustomerUpdateProfileFormData,
  ProfessionalUpdateProfileFormData,
  ManagerUpdateProfileFormData,
}
