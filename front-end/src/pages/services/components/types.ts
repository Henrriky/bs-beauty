import { z } from 'zod'
import { ServiceSchemas } from '../../../utils/validation/zod-schemas/service.zod-schemas.validation.utils'

type CreateServiceFormData = z.infer<typeof ServiceSchemas.createSchema>

type OnSubmitCreateServiceForm = (data: CreateServiceFormData) => Promise<void>

export type { CreateServiceFormData, OnSubmitCreateServiceForm }
