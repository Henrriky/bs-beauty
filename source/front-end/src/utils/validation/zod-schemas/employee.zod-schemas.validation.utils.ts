import { z } from 'zod'
import { RegexPatterns } from '../regex.validation.util'
import { SharedSchemas } from './shared-zod-schemas.validation.utils'

class EmployeeSchemas {
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

  public static readonly employeeCompleteRegisterBodySchema = z
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
      socialMedia: EmployeeSchemas.socialMediaSchema.optional(),
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
      userType: z.enum(['MANAGER', 'EMPLOYEE']).optional(),
    })
    .strict()

  public static managerUpdateSchema = z
    .object({
      name: SharedSchemas.nameSchema,
      email: z.string().email().optional(),
      socialMedia: EmployeeSchemas.socialMediaSchema.optional(),
      contact: z
        .string()
        .refine((value) => RegexPatterns.phone.test(value))
        .optional(),
      userType: z.enum(['MANAGER', 'EMPLOYEE']).optional(),
      specialization: SharedSchemas.specializationSchema,
    })
    .strict()

  public static employeeUpdateSchema = z
    .object({
      name: SharedSchemas.nameSchema,
      email: z.string().email().optional(),
      socialMedia: EmployeeSchemas.socialMediaSchema.optional(),
      contact: z
        .string()
        .refine((value) => RegexPatterns.phone.test(value))
        .optional(),
      specialization: SharedSchemas.specializationSchema,
    })
    .strict()

  public static registerEmployeeBodySchema = SharedSchemas.registerBodySchema
}

export { EmployeeSchemas }
