import { z } from 'zod'
import { CustomerSchemas } from '../../../utils/validation/zod-schemas/customer.zod-schemas.validation.util'

type CustomerUpdateProfileFormData = z.infer<
  typeof CustomerSchemas.updateSchema
>

export type { CustomerUpdateProfileFormData }
