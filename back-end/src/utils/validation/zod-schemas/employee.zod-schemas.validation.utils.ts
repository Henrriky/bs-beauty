import { z } from 'zod'
import { RegexPatterns } from '../regex.validation.util'

class EmployeeSchemas {
  public static readonly socialMediaSchema = z.array(z.object({
    name: z.string().min(1).max(50),
    url: z.string().url()
  }).strict())

  public static readonly employeeCompleteRegisterBodySchema = z.object({
    name: z.string().min(3).max(100).refine((string) => RegexPatterns.names.test(string)),
    socialMedia: EmployeeSchemas.socialMediaSchema.optional(),
    contact: z.string().refine((value) => RegexPatterns.phone.test(value))
  }).strict()

  public static createSchema = z.object({
    email: z.string().email(),
    role: z.enum(['MANAGER', 'EMPLOYEE']).optional()
  }).strict()

  public static managerUpdateSchema = z.object({
    name: z.string().min(3).max(100).refine((string) => RegexPatterns.names.test(string)).optional(),
    email: z.string().email().optional(),
    socialMedia: EmployeeSchemas.socialMediaSchema.optional(),
    contact: z.string().refine((value) => RegexPatterns.phone.test(value)).optional(),
    role: z.enum(['MANAGER', 'EMPLOYEE']).optional()
  }).strict()

  public static employeeUpdateSchema = z.object({
    name: z.string().min(3).max(100).refine((string) => RegexPatterns.names.test(string)).optional(),
    email: z.string().email().optional(),
    socialMedia: EmployeeSchemas.socialMediaSchema.optional(),
    contact: z.string().refine((value) => RegexPatterns.phone.test(value)).optional()
  }).strict()
}

export { EmployeeSchemas }
