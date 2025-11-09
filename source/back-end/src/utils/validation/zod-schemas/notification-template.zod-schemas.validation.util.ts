import z from 'zod'

class NotificationTemplateSchemas {
  public static updateSchema = z.object({
    title: z.string().min(1).max(90).transform((s) => s.trim()).optional(),
    body: z.string().min(1).max(200).optional(),
    isActive: z.boolean().optional()
  }).strict()
}

export { NotificationTemplateSchemas }
