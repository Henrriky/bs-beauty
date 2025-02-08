import { z } from 'zod'
import { RegexPatterns } from '../regex.validation.util'

class ServiceSchemas {
  public static createSchema = z
    .object({
      name: z
        .string()
        .nonempty('O nome é obrigatório')
        .min(3, 'O nome deve ter no mínimo 3 caracteres')
        .max(50, 'O nome deve ter no máximo 100 caracteres')
        .refine(
          (string) => RegexPatterns.names.test(string),
          'Por favor, forneça um nome válido.',
        ),
      description: z
        .string()
        .nonempty('A descrição é obrigatória')
        .min(10, 'A descrição deve ter no mínimo 10 caracteres')
        .max(500, 'A descrição deve ter no máximo 500 caracteres')
        .refine(
          (string) => RegexPatterns.content.test(string),
          'Por favor, forneça uma descrição válida.',
        ),
      category: z
        .string()
        .nonempty('A categoria é obrigatória')
        .min(2, 'A categoria deve ter no mínimo 2 caracteres')
        .max(30, 'A categoria deve ter no máximo 255 caracteres')
        .refine(
          (string) => RegexPatterns.names.test(string),
          'Por favor, forneça uma categoria válida.',
        ),
    })
    .strict()

  public static updateSchema = z
    .object({
      name: z
        .string()
        .nonempty('O nome é obrigatório')
        .min(3, 'O nome deve ter no mínimo 3 caracteres')
        .max(50, 'O nome deve ter no máximo 100 caracteres')
        .refine(
          (string) => RegexPatterns.names.test(string),
          'Por favor, forneça um nome válido.',
        )
        .optional(),
      description: z
        .string()
        .min(2)
        .max(500, 'A descrição deve ter no máximo 500 caracteres')
        .refine(
          (string) => RegexPatterns.content.test(string),
          'Por favor, forneça uma descrição válida.',
        )
        .optional(),
      category: z
        .string()
        .nonempty('A categoria é obrigatória')
        .min(2, 'A categoria deve ter no mínimo 2 caracteres')
        .max(30, 'A categoria deve ter no máximo 255 caracteres')
        .refine(
          (string) => RegexPatterns.names.test(string),
          'Por favor, forneça uma categoria válida.',
        )
        .optional(),
    })
    .strict()
}

export { ServiceSchemas }
