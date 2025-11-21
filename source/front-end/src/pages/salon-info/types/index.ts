import { z } from 'zod'
import { SalonInfoSchemas } from '../../../utils/validation/zod-schemas/salon-info.zod-schemas.validation.utils'

type SalonInfoUpdateFormData = z.infer<typeof SalonInfoSchemas.updateSchema>

type OnSubmitSalonInfoUpdateFormData = (
  data: SalonInfoUpdateFormData,
) => Promise<void>

export type { SalonInfoUpdateFormData, OnSubmitSalonInfoUpdateFormData }
