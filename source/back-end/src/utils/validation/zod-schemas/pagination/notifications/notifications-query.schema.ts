import { z } from 'zod'
import { basePaginationSchema } from '../pagination.schema'

const ReadStatusEnum = z.enum(['ALL', 'READ', 'UNREAD'])

const readStatusParam = z
  .string()
  .trim()
  .transform((v) => v.toUpperCase())
  .pipe(ReadStatusEnum)
  .optional()
  .default('ALL')

export const partialNotificationQuerySchema = {
  readStatus: readStatusParam
}

export const notificationQuerySchema = basePaginationSchema.extend(
  partialNotificationQuerySchema
)

export type NotificationQuerySchema = z.infer<typeof notificationQuerySchema>
export type PartialNotificationQuerySchema = Pick<NotificationQuerySchema, 'readStatus'>
