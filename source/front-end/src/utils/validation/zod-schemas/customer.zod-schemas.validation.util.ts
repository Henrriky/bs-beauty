import { z } from 'zod'
import { SharedSchemas } from './shared-zod-schemas.validation.utils'
import { RegexPatterns } from '../regex.validation.util'

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
    })
    .strict()

  public static registerCustomerBodySchema = z
    .object({
      email: z.string().email(),
      password: z.string().regex(RegexPatterns.password, {
        message:
          'A senha deve ter pelo menos 8 caracteres e incluir: uma letra maiúscula, uma letra minúscula, um número e um caractere especial (@!%*?&).',
      }),
      confirmPassword: z.string().regex(RegexPatterns.password, {
        message:
          'A confimação de senha deve seguir as mesmas regras que a senha.',
      }),
    })
    .strict()
    .superRefine((data, ctx) => {
      const hasPassword = !!data.password
      const hasConfirm = !!data.confirmPassword
      if (hasPassword !== hasConfirm) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Ambas senha e confirmação de senha devem ser preenchidas.',
          path: hasPassword ? ['confirmPassword'] : ['password'],
        })
      }

      if (hasPassword && hasConfirm && data.password !== data.confirmPassword) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'As senhas digitadas não coincidem.',
          path: ['confirmPassword'],
        })
      }
    })
}

export { CustomerSchemas }
