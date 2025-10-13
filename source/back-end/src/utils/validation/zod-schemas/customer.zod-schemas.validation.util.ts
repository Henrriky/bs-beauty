import { z } from 'zod'
import { RegexPatterns } from '../regex.validation.util'
import { SharedSchemas } from './shared-zod-schemas.validations.utils'
import { DiscoverySource } from '@prisma/client'

const discoverySourceSchema = z.preprocess(
  (v) => (v === '' ? undefined : v),
  z.nativeEnum(DiscoverySource).optional()
).refine((v) => v !== undefined, { message: 'Selecione uma opção' })

class CustomerSchemas {
  public static customerCompleteRegisterBodySchema = z.object({
    name: z.string().min(3).max(100).refine((string) => RegexPatterns.names.test(string)),
    birthdate: z.preprocess((arg) => {
      if (typeof arg === 'string' || arg instanceof Date) {
        return new Date(arg)
      }
      return arg
    }, z.date().refine((date) => !isNaN(date.getTime()) && date < new Date())),
    phone: z.string().refine((value) => RegexPatterns.phone.test(value)),
    discoverySource: discoverySourceSchema,
  }).strict()

  public static createSchema = z.object({
    name: z.string().min(3).max(100).refine((string) => RegexPatterns.names.test(string)),
    birthdate: z.date().refine((date) => !isNaN(date.getTime()) && date < new Date()),
    email: z.string().email(),
    phone: z.string().refine((value) => RegexPatterns.phone.test(value))
  }).strict()

  public static updateSchema = z.object({
    name: z.string().min(3).max(100).refine((string) => RegexPatterns.names.test(string)).optional(),
    birthdate: z.date().refine((date) => !isNaN(date.getTime()) && date < new Date()).optional(),
    email: z.string().email().optional(),
    alwaysAllowImageUse: z.boolean().optional(),
    phone: z.string().refine((value) => RegexPatterns.phone.test(value))
  }).strict()

  public static registerCustomerBodySchema = SharedSchemas.registerBodySchema
}

export { CustomerSchemas }
