import type { Role } from '@prisma/client'
import type { NextFunction, Request, Response } from 'express'
import { AppErrorCodes } from '../utils/errors/app-error-codes'

const routeAuthMiddleware = (roles: Role[]) => (req: Request, res: Response, next: NextFunction) => {
  let isAbleToCallNext = true
  const role = req.user.role
  if (role == null) {
    res.status(401).send({ statusCode: 401, message: 'Unauthorized', details: AppErrorCodes.ROLE_NON_EXISTENT })
    isAbleToCallNext = false
  }
  if (!roles.includes(role as Role)) {
    res.status(403).send({ statusCode: 401, message: 'Unauthorized', details: AppErrorCodes.ROLE_INSUFFICIENT })
    isAbleToCallNext = false
  }
  if (isAbleToCallNext) {
    next()
  }
}

export { routeAuthMiddleware }
