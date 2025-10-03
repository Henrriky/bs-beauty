import { z } from 'zod'
import { RegexPatterns } from '../regex.validation.util'
import { NotificationPreference } from '../../../store/auth/types'

export const NotificationChannelEnum = z.enum(['NONE', 'IN_APP', 'EMAIL', 'BOTH'], {
  required_error: 'Por favor, selecione um canal de notificação',
  invalid_type_error: 'Opção inválida',
})

class SharedSchemas {
  public static nameSchema = z
    .string({
      message: 'O nome é obrigatório',
    })
    .min(3, 'O nome deve ter no mínimo 3 caracteres')
    .max(100, 'O nome deve ter no máximo 100 caracteres')
    .refine(
      (string) => RegexPatterns.names.test(string),
      'Por favor, forneça um nome válido.',
    )

  public static birthdateSchema = z.preprocess(
    (arg) => {
      if (typeof arg === 'string' || arg instanceof Date) {
        const isDayMonthYearFormat = arg
          .toString()
          .match(RegexPatterns.dayMonthYearFormat)

        if (isDayMonthYearFormat) {
          const [, day, month, year] = isDayMonthYearFormat

          const utcDate = new Date(
            Date.UTC(Number(year), Number(month) - 1, Number(day)),
          )
          utcDate.setHours(utcDate.getHours() + 4)
          return utcDate
        }

        if (arg instanceof Date) {
          const utcDate = new Date(
            Date.UTC(arg.getUTCFullYear(), arg.getUTCMonth(), arg.getUTCDate()),
          )

          utcDate.setHours(utcDate.getHours() + 4)
          return utcDate
        }

        return new Date(arg)
      }
      return arg
    },
    z
      .date({
        errorMap: (issue, { defaultError }) => ({
          message:
            issue.code === 'invalid_date'
              ? 'Por favor, forneça uma data de nascimento válida'
              : defaultError,
        }),
      })
      .refine(
        (date) => !isNaN(date.getTime()) && date < new Date(),
        'Por favor, forneça uma data de nascimento válida',
      ),
  )

  public static phoneSchema = z
    .string({ message: 'O telefone de contato é obrigatório' })
    .refine(
      (value) => RegexPatterns.phone.test(value),
      'Por favor, forneça um número de telefone válido',
    )

  public static specializationSchema = z
    .string()
    .max(50, 'A especialização deve ter no máximo 50 caracteres')
    .optional()

  public static notificationPreference = z.nativeEnum(NotificationPreference).optional()

  public static registerBodySchema = z
    .object({
      email: z.string().email(),
      password: z.string().regex(RegexPatterns.password, {
        message:
          'A senha deve ter ao menos 8 caracteres e incluir uma letra maiúscula, uma letra minúscula, um número e um caractere especial (@$!%*?&).',
      }),
      confirmPassword: z.string().regex(RegexPatterns.password, {
        message:
          'A senha de confirmação deve seguir as mesmas regras que a senha.',
      }),
    })
    .strict()
    .superRefine((data, ctx) => {
      const hasPassword = !!data.password
      const hasConfirm = !!data.confirmPassword
      if (hasPassword !== hasConfirm) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Ambas senhas e confirmação devem ser preenchidas.',
          path: hasPassword ? ['confirmPassword'] : ['password'],
        })
      }

      if (hasPassword && hasConfirm && data.password !== data.confirmPassword) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'A senha e a confirmação não coincidem.',
          path: ['confirmPassword'],
        })
      }
    })
}

export { SharedSchemas }
