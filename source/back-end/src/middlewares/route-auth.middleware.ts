import type { UserType } from '@prisma/client'
import type { NextFunction, Request, Response } from 'express'
import { AppErrorCodes } from '../utils/errors/app-error-codes'

const routeAuthMiddleware = (userTypes: UserType[]) => (req: Request, res: Response, next: NextFunction) => {
  let isAbleToCallNext = true
  const userType = req.user.userType
  if (userType == null) {
    res.status(401).send({ statusCode: 401, message: 'Unauthorized', details: AppErrorCodes.USER_TYPE_NON_EXISTENT })
    isAbleToCallNext = false
  }
  if (!userTypes.includes(userType as UserType)) {
    res.status(403).send({ statusCode: 401, message: 'Unauthorized', details: AppErrorCodes.USER_TYPE_INSUFFICIENT })
    isAbleToCallNext = false
  }
  if (isAbleToCallNext) {
    next()
  }
}

export { routeAuthMiddleware }
