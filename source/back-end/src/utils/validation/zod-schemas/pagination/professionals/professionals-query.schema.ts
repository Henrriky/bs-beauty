import { z } from 'zod'
import { basePaginationSchema } from '../pagination.schema'

export const professionalQuerySchema = basePaginationSchema.extend({
  name: z.string().max(191).optional(),
  email: z.string().max(191).optional()
})

export type ProfessionalQuerySchema = z.infer<typeof professionalQuerySchema>

export const partialHandleFetchServicesOfferedByProfessionalQuerySchema = {
  q: z.string().max(50).optional(),
  category: z.string().max(30).optional()
}

export const handleFetchServicesOfferedByProfessionalQuerySchema = basePaginationSchema.extend(partialHandleFetchServicesOfferedByProfessionalQuerySchema)

export type HandleFetchServicesOfferedByProfessionalQuerySchema = z.infer<typeof handleFetchServicesOfferedByProfessionalQuerySchema>
export type PartialHandleFetchServicesOfferedByProfessionalQuerySchema = Pick<z.infer<typeof handleFetchServicesOfferedByProfessionalQuerySchema>, 'q' | 'category' >
