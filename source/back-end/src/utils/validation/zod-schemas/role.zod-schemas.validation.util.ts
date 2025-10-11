import { z } from 'zod'

class RoleSchemas {
  public static createSchema = z.object({
    name: z.string()
      .min(2, { message: 'Nome deve ter pelo menos 2 caracteres' })
      .max(50, { message: 'Nome deve ter no máximo 50 caracteres' })
      .trim()
      .refine(
        (name) => /^[a-zA-ZÀ-ÿ0-9\s._-]+$/.test(name),
        { message: 'Nome deve conter apenas letras, números, espaços, pontos, underscores e hífens' }
      ),
    description: z.string()
      .max(500, { message: 'Descrição deve ter no máximo 500 caracteres' })
      .optional(),
    isActive: z.boolean()
      .optional()
      .default(true)
  }).strict()

  public static updateSchema = z.object({
    name: z.string()
      .min(2, { message: 'Nome deve ter pelo menos 2 caracteres' })
      .max(50, { message: 'Nome deve ter no máximo 50 caracteres' })
      .trim()
      .refine(
        (name) => /^[a-zA-ZÀ-ÿ0-9\s._-]+$/.test(name),
        { message: 'Nome deve conter apenas letras, números, espaços, pontos, underscores e hífens' }
      )
      .optional(),
    description: z.string()
      .max(500, { message: 'Descrição deve ter no máximo 500 caracteres' })
      .optional(),
    isActive: z.boolean()
      .optional()
  }).strict()
}

export { RoleSchemas }
