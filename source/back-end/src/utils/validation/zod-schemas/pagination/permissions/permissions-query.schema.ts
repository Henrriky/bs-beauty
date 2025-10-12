import { z } from 'zod'
import { basePaginationSchema } from '../pagination.schema'

const permissionQuerySchema = basePaginationSchema.extend({
  resource: z.string().optional(),
  action: z.string().optional(),
  search: z.string().optional()
})

export { permissionQuerySchema }
