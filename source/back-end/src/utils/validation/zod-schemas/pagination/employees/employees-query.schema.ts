import { z } from 'zod'
import { basePaginationSchema } from '../pagination.schema'

export const employeeQuerySchema = basePaginationSchema.extend({
  name: z.string().optional(),
  email: z.string().optional(),
})

export type EmployeeQuerySchema = z.infer<typeof employeeQuerySchema>