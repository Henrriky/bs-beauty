import { z } from 'zod'
import { RegexPatterns } from '../regex.validation.util'

class NotificationSchemas {
  public static createSchema = z.object({
    title: z.string().min(3).refine((string) => RegexPatterns.names.test(string)),
    content: z.string().min(3).refine((string) => RegexPatterns.content.test(string)),
    employeeId: z.string().uuid().optional().nullable(),
    customerId: z.string().uuid().optional().nullable()
  }).strict().refine((data) => {
    const employeeId = data.employeeId
    const customerId = data.customerId

    return (employeeId != null && customerId == null) || (employeeId == null && customerId != null)
  },
  {
    message: "Cannot set both 'employeeId' and 'customerId'",
    path: ['employeeId', 'customerId']
  })
}

export { NotificationSchemas }
