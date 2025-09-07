import { z } from 'zod'
import { RegexPatterns } from '../regex.validation.util'

class ProfessionalSchemas {
  public static readonly socialMediaSchema = z.array(z.object({
    name: z.string().min(1).max(50),
    url: z.string().url()
  }).strict())

  public static readonly professionalCompleteRegisterBodySchema = z.object({
    name: z.string().min(3).max(100).refine((string) => RegexPatterns.names.test(string)),
    socialMedia: ProfessionalSchemas.socialMediaSchema.optional(),
    contact: z.string().refine((value) => RegexPatterns.phone.test(value))
  }).strict()

  public static createSchema = z.object({
    email: z.string().email(),
    socialMedia: ProfessionalSchemas.socialMediaSchema.optional(),
    contact: z.string().refine((value) => RegexPatterns.phone.test(value)).optional(),
    userType: z.enum(['MANAGER', 'PROFESSIONAL']).optional(),
    specialization: z.string().min(3).max(3).optional()
  }).strict()

  public static managerUpdateSchema = z.object({
    name: z.string().min(3).max(100).refine((string) => RegexPatterns.names.test(string)).optional(),
    email: z.string().email().optional(),
    socialMedia: ProfessionalSchemas.socialMediaSchema.optional(),
    contact: z.string().refine((value) => RegexPatterns.phone.test(value)).optional(),
    userType: z.enum(['MANAGER', 'PROFESSIONAL']).optional(),
    specialization: z.string().min(3).max(3).optional()
  }).strict()

  public static professionalUpdateSchema = z.object({
    name: z.string().min(3).max(100).refine((string) => RegexPatterns.names.test(string)).optional(),
    email: z.string().email().optional(),
    socialMedia: ProfessionalSchemas.socialMediaSchema.optional(),
    contact: z.string().refine((value) => RegexPatterns.phone.test(value)).optional(),
    specialization: z.string().min(3).max(3).optional()
  }).strict()
}

export { ProfessionalSchemas }
