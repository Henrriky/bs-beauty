import type { NextFunction, Request, Response } from 'express'
import { CustomError } from '../utils/errors/custom.error'

const errorHandlerMiddleware = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err)
  res.setHeader('Content-Type', 'application/json')
  if (err instanceof CustomError) {
    res.send({ statusCode: err.statusCode, message: err.message, details: err.details })
  } else {
    res.send({ statusCode: 500, message: 'An unexpected error ocurred' })
  }
}

export { errorHandlerMiddleware }
