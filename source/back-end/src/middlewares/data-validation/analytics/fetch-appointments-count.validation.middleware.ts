import { formatValidationErrors } from "@/utils/formatting/zod-validation-errors.formatting.util"
import { Request, Response, NextFunction } from "express"
import z from "zod"

const getAnalyticsSchema = z.object({
  body: z.object({
    startDate: z.string().datetime({ message: 'Invalid startDate. Must be a valid ISO date string.' }),
    endDate: z.string().datetime({ message: 'Invalid endDate. Must be a valid ISO date string.' }),
    statusList: z.array(z.string()).optional(),
    professionalId: z.string().optional(),
  }),
})

const validateFetchAppointmentsCount = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    getAnalyticsSchema.parse(req)
    next()
  } catch (error) {
    if (error instanceof z.ZodError) {
      formatValidationErrors(error, res)
      return
    }
    next(error)
  }
}

export { validateFetchAppointmentsCount }