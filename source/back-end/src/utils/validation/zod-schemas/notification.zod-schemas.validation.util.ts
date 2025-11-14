import { z } from 'zod'
import { RegexPatterns } from '../regex.validation.util'

class NotificationSchemas {
  public static createSchema = z.object({
    title: z.string().min(3).max(50).refine((string) => RegexPatterns.names.test(string)),
    content: z.string().min(3).max(255).refine((string) => RegexPatterns.content.test(string)),
    professionalId: z.string().uuid().optional().nullable(),
    customerId: z.string().uuid().optional().nullable()
  }).strict().refine((data) => {
    const professionalId = data.professionalId
    const customerId = data.customerId

    return (professionalId != null && customerId == null) || (professionalId == null && customerId != null)
  },
  {
    message: "Cannot set both 'professionalId' and 'customerId'",
    path: ['professionalId', 'customerId']
  })
}

export { NotificationSchemas }
