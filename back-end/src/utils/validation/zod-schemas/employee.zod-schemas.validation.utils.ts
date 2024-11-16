import { z } from 'zod'
import { RegexPatterns } from '../regex.validation.util'

class EmployeeSchemas {
  public static readonly socialMediaSchema = z.array(z.object({
    name: z.string().min(1),
    url: z.string().url()
  }).strict())

  public static createSchema = z.object({
    name: z.string().min(3).refine((string) => RegexPatterns.names.test(string)),
    email: z.string().email(),
    passwordHash: z.string().refine((pass) => RegexPatterns.password.test(pass)),
    socialMedia: EmployeeSchemas.socialMediaSchema.optional(),
    contact: z.string().refine((value) => RegexPatterns.phone.test(value)).optional(),
    role: z.enum(['MANAGER', 'EMPLOYEE']).optional()
  }).strict()

  public static managerUpdateSchema = z.object({
    name: z.string().min(3).refine((string) => RegexPatterns.names.test(string)).optional(),
    email: z.string().email().optional(),
    passwordHash: z.string().refine((pass) => RegexPatterns.password.test(pass)).optional(),
    socialMedia: EmployeeSchemas.socialMediaSchema.optional(),
    contact: z.string().refine((value) => RegexPatterns.phone.test(value)).optional(),
    role: z.enum(['MANAGER', 'EMPLOYEE']).optional()
  }).strict()

  public static employeeUpdateSchema = z.object({
    name: z.string().min(3).refine((string) => RegexPatterns.names.test(string)).optional(),
    email: z.string().email().optional(),
    passwordHash: z.string().refine((pass) => RegexPatterns.password.test(pass)).optional(),
    socialMedia: EmployeeSchemas.socialMediaSchema.optional(),
    contact: z.string().refine((value) => RegexPatterns.phone.test(value)).optional()
  }).strict()
}

export { EmployeeSchemas }
