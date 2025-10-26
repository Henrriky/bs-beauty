import type { NextFunction, Request, Response } from 'express'
import { CustomError } from '../utils/errors/custom.error.util'
import { AppLoggerInstance } from '@/utils/logger/logger.util'

const errorHandlerMiddleware = (err: any, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof CustomError) {
    AppLoggerInstance.warn('[Middleware] Occured a Known Error: ', { path: req.path, method: req.method, details: { message: err.message, statusCode: err.statusCode, details: err.details } })
    res.status(err.statusCode).send({ statusCode: err.statusCode, message: err.message, details: err.details })
  } else {
    AppLoggerInstance.error('[Middleware] Occured an Unknown Error: ', err, { path: req.path, method: req.method })
    res.status(500).send({ statusCode: 500, message: 'Internal Server Error', details: 'An unexpected error ocurred' })
  }
}

export { errorHandlerMiddleware }
