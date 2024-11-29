import { z } from 'zod'
import { RegexPatterns } from '../regex.validation.util'

class CustomerSchemas {
  public static customerCompleteRegisterBodySchema = z
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
      birthdate: z.preprocess(
        (arg) => {
          if (typeof arg === 'string' || arg instanceof Date) {
            const isDayMonthYearFormat = arg
              .toString()
              .match(RegexPatterns.dayMonthYearFormat)

            if (isDayMonthYearFormat) {
              const [, day, month, year] = isDayMonthYearFormat
              return new Date(`${year}-${month}-${day}`)
            }

            return new Date(arg)
          }
          return arg
        },
        z
          .date({
            errorMap: (issue, { defaultError }) => ({
              message: issue.code === "invalid_date" ? 'Por favor, forneça uma data de nascimento válida' : defaultError,
            }),
          })
          .refine(
            (date) => !isNaN(date.getTime()) && date < new Date(),
            'Por favor, forneça uma data de nascimento válida',
          ),
      ),
      phone: z
        .string({ message: 'O telefone de contato é obrigatório' })
        .refine(
          (value) => RegexPatterns.phone.test(value),
          'Por favor, forneça um número de telefone válido',
        ),
    })
    .strict()

  public static createSchema = z
    .object({
      name: z
        .string()
        .min(3)
        .max(100)
        .refine((string) => RegexPatterns.names.test(string)),
      birthdate: z
        .date()
        .refine((date) => !isNaN(date.getTime()) && date < new Date()),
      email: z.string().email(),
      phone: z.string().refine((value) => RegexPatterns.phone.test(value)),
    })
    .strict()

  public static updateSchema = z
    .object({
      name: z
        .string()
        .min(3)
        .max(100)
        .refine((string) => RegexPatterns.names.test(string))
        .optional(),
      birthdate: z
        .date()
        .refine((date) => !isNaN(date.getTime()) && date < new Date())
        .optional(),
      email: z.string().email().optional(),
      phone: z
        .string()
        .refine((value) => RegexPatterns.phone.test(value))
        .optional(),
    })
    .strict()
}

export { CustomerSchemas }
