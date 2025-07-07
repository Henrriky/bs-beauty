import { z } from 'zod'
import { basePaginationSchema } from '../pagination.schema'

export const employeeQuerySchema = basePaginationSchema.extend({
  name: z.string().max(191).optional(),
  email: z.string().max(191).optional()
})

export type EmployeeQuerySchema = z.infer<typeof employeeQuerySchema>
