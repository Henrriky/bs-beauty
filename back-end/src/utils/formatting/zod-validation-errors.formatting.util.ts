import type { ZodError } from 'zod'
import type { Response } from 'express'

function formatValidationErrors (error: ZodError, res: Response) {
  const formattedErrors = error.errors.map((error) => ({
    field: error.path[0],
    message: error.message
  }))

  res.status(400).json({
    statusCode: 400,
    message: 'Validation Error',
    errors: formattedErrors
  })
}

export { formatValidationErrors }
