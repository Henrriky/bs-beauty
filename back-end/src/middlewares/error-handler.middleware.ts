import type { NextFunction, Request, Response } from 'express'
import { CustomError } from '../utils/errors/custom.error.util'

const errorHandlerMiddleware = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err)
  res.setHeader('Content-Type', 'application/json')
  if (err instanceof CustomError) {
    res.status(err.statusCode).send({ statusCode: err.statusCode, message: err.message, details: err.details })
  } else {
    res.status(500).send({ statusCode: 500, message: 'Internal Server Error', details: 'An unexpected error ocurred' })
  }
}

export { errorHandlerMiddleware }
