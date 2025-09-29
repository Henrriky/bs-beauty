import { z } from 'zod'
import { ServiceSchemas } from '../../../utils/validation/zod-schemas/service.zod-schemas.validation.utils'
import { OfferSchemas } from '../../../utils/validation/zod-schemas/offer.zod-schemas.validation.utils'

type CreateServiceFormData = z.infer<typeof ServiceSchemas.createSchema>

type CreateOfferFormData = z.infer<typeof OfferSchemas.createSchema>

type UpdateOfferFormData = z.infer<typeof OfferSchemas.updateSchema>

type UpdateServiceFormData = z.infer<typeof ServiceSchemas.updateSchema>

type UpdateServiceStatusFormData = z.infer<
  typeof ServiceSchemas.updateStatusSchema
>

type OnSubmitCreateServiceForm = (data: CreateServiceFormData) => Promise<void>

type OnSubmitCreateOfferForm = (data: CreateOfferFormData) => Promise<void>

type OnSubmitUpdateOfferForm = (data: UpdateOfferFormData) => Promise<void>

type OnSubmitUpdateServiceForm = (data: UpdateServiceFormData) => Promise<void>

type OnSubmitUpdateServiceStatusForm = (
  data: UpdateServiceStatusFormData,
) => Promise<void>

export type {
  CreateServiceFormData,
  OnSubmitCreateServiceForm,
  CreateOfferFormData,
  OnSubmitCreateOfferForm,
  UpdateOfferFormData,
  OnSubmitUpdateOfferForm,
  UpdateServiceFormData,
  OnSubmitUpdateServiceForm,
  OnSubmitUpdateServiceStatusForm,
}
