import { z } from 'zod'
import { basePaginationSchema } from '../pagination.schema'

export const notificationTemplateQuerySchema = basePaginationSchema.extend({
  name: z.string().max(80).optional(),
  key: z.string().max(30).optional()
})

export type NotificationTemplateQuerySchema = z.infer<typeof notificationTemplateQuerySchema>
