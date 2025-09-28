import { z } from 'zod'

const permissionQuerySchema = z.object({
  page: z.string().optional().transform(val => {
    if (val == null || val.length === 0) return 1
    const parsed = parseInt(val, 10)
    return isNaN(parsed) || parsed <= 0 ? 1 : parsed
  }),
  limit: z.string().optional().transform(val => {
    if (val == null || val.length === 0) return 10
    const parsed = parseInt(val, 10)
    return isNaN(parsed) || parsed <= 0 ? 10 : parsed
  }),
  resource: z.string().optional(),
  action: z.string().optional(),
  search: z.string().optional()
}).strict()

export { permissionQuerySchema }
