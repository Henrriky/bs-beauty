import { z } from 'zod'
import { SharedSchemas } from './shared-zod-schemas.validation.utils'

class CustomerSchemas {
  public static customerCompleteRegisterBodySchema = z
    .object({
      name: SharedSchemas.nameSchema,
      birthdate: SharedSchemas.birthdateSchema,
      phone: SharedSchemas.phoneSchema,
    })
    .strict()

  public static createSchema = z
    .object({
      name: SharedSchemas.nameSchema,
      birthdate: SharedSchemas.birthdateSchema,
      phone: SharedSchemas.phoneSchema,
      email: z.string().email(),
    })
    .strict()

  public static updateSchema = z
    .object({
      name: SharedSchemas.nameSchema,
      birthdate: SharedSchemas.birthdateSchema,
      email: z
        .string({
          message: 'O email é obrigatório',
        })
        .email({
          message: 'Por favor, forneça um e-mail válido',
        }),
      phone: SharedSchemas.phoneSchema,
      alwaysAllowImageUse: z.boolean().optional(),
    })
    .strict()

  public static registerCustomerBodySchema = SharedSchemas.registerBodySchema
}

export { CustomerSchemas }
