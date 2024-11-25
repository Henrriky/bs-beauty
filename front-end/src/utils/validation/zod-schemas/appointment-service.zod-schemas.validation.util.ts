// import { z } from 'zod'
// import { RegexPatterns } from '../regex.validation.util'
// import { Status } from '@prisma/client'

// class AppointmentServiceSchemas {
//   public static createSchema = z
//     .object({
//       observation: z
//         .string()
//         .min(3)
//         .max(255)
//         .refine((string) => RegexPatterns.content.test(string))
//         .optional(),
//       appointmentDate: z
//         .date()
//         .refine((date) => !isNaN(date.getTime()) && date > new Date()),
//       appointmentId: z.string().uuid(),
//       serviceId: z.string().uuid(),
//     })
//     .strict()

//   public static customerUpdateSchema = z
//     .object({
//       observation: z
//         .string()
//         .min(3)
//         .max(255)
//         .refine((string) => RegexPatterns.content.test(string))
//         .optional(),
//       appointmentDate: z
//         .date()
//         .refine((date) => !isNaN(date.getTime()) && date < new Date())
//         .optional(),
//     })
//     .strict()

//   public static employeeUpdateSchema = z
//     .object({
//       status: z.nativeEnum(Status).optional(),
//       appointmentDate: z
//         .date()
//         .refine((date) => !isNaN(date.getTime()) && date < new Date())
//         .optional(),
//     })
//     .strict()
// }

// export { AppointmentServiceSchemas }
