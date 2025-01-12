import { z } from 'zod'
import { ServiceSchemas } from '../../../utils/validation/zod-schemas/service.zod-schemas.validation.utils'
import { OfferSchemas } from '../../../utils/validation/zod-schemas/offer.zod-schemas.validation.utils'

type CreateServiceFormData = z.infer<typeof ServiceSchemas.createSchema>

type CreateOfferFormData = z.infer<typeof OfferSchemas.createSchema>

type OnSubmitCreateServiceForm = (data: CreateServiceFormData) => Promise<void>

type OnSubmitCreateOfferForm = (data: CreateOfferFormData) => Promise<void>

export type {
  CreateServiceFormData,
  OnSubmitCreateServiceForm,
  CreateOfferFormData,
  OnSubmitCreateOfferForm,
}
