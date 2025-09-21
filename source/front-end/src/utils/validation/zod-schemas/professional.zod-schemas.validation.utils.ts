import { z } from 'zod'
import { RegexPatterns } from '../regex.validation.util'
import { SharedSchemas } from './shared-zod-schemas.validation.utils'

class ProfessionalSchemas {
  public static readonly socialMediaSchema = z
    .array(
      z
        .object({
          name: z
            .string({ message: 'O nome é obrigatório' })
            .min(1, 'O nome deve ter no mínimo 1 caracter')
            .max(50, 'O nome deve ter no mínimo 50 caracteres'),
          url: z
            .string({ message: 'A URL é obrigatória' })
            .url('Forneça uma URL válida'),
        })
        .strict(),
    )
    .max(5)

  public static readonly paymentMethodSchema = z
    .array(
      z
        .object({
          name: z
            .string({ message: 'O nome é obrigatório' })
            .min(1, 'O nome deve ter no mínimo 1 caracter')
            .max(50, 'O nome deve ter no mínimo 50 caracteres'),
        })
        .strict(),
    )
    .max(10, 'Adicione no máximo 10 métodos de pagamento')
    .optional()
    .nullable()

  public static readonly professionalCompleteRegisterBodySchema = z
    .object({
      name: z
        .string({
          message: 'O nome é obrigatório',
        })
        .min(3, 'O nome deve ter no mínimo 3 caracteres')
        .max(100, 'O nome deve ter no máximo 100 caracteres')
        .refine(
          (string) => RegexPatterns.names.test(string),
          'Por favor, forneça um nome válido.',
        ),
      socialMedia: ProfessionalSchemas.socialMediaSchema.optional(),
      paymentMethods: ProfessionalSchemas.paymentMethodSchema.optional(),
      contact: z
        .string({ message: 'O telefone de contato é obrigatório' })
        .refine(
          (value) => RegexPatterns.phone.test(value),
          'Por favor, forneça um número de telefone válido',
        ),
    })
    .strict()

  public static createSchema = z
    .object({
      email: z
        .string({ required_error: 'O e-mail é obrigatório' })
        .email('Formato de e-mail inválido.'),
      userType: z.enum(['MANAGER', 'PROFESSIONAL']).optional(),
    })
    .strict()

  public static managerUpdateSchema = z
    .object({
      name: SharedSchemas.nameSchema,
      email: z.string().email().optional(),
      socialMedia: ProfessionalSchemas.socialMediaSchema.optional(),
      paymentMethods: ProfessionalSchemas.paymentMethodSchema.optional(),
      contact: z
        .string()
        .refine((value) => RegexPatterns.phone.test(value))
        .optional(),
      userType: z.enum(['MANAGER', 'PROFESSIONAL']).optional(),
      specialization: SharedSchemas.specializationSchema,
    })
    .strict()

  public static professionalUpdateSchema = z
    .object({
      name: SharedSchemas.nameSchema,
      email: z.string().email().optional(),
      socialMedia: ProfessionalSchemas.socialMediaSchema.optional(),
      paymentMethods: ProfessionalSchemas.paymentMethodSchema.optional(),
      contact: z
        .string()
        .refine((value) => RegexPatterns.phone.test(value))
        .optional(),
      specialization: SharedSchemas.specializationSchema,
    })
    .strict()

  public static registerEmployeeBodySchema = SharedSchemas.registerBodySchema
}

export { ProfessionalSchemas }
