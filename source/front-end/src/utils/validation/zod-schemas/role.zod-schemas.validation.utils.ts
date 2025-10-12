import { z } from 'zod'

class RoleSchemas {
  public static readonly createSchema = z.object({
    name: z
      .string({
        message: 'Nome é obrigatório',
      })
      .min(2, { message: 'Nome deve ter pelo menos 2 caracteres' })
      .max(50, { message: 'Nome deve ter no máximo 50 caracteres' })
      .trim(),
    description: z
      .string()
      .max(500, { message: 'Descrição deve ter no máximo 500 caracteres' })
      .optional(),
    isActive: z.boolean().default(true),
  })
}

export { RoleSchemas }
