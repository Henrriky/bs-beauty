import type { Role } from '@prisma/client'
import type { NextFunction, Request, Response } from 'express'

const routeAuthMiddleware = (roles: Role[]) => (req: Request, res: Response, next: NextFunction) => {
  let isAbleToCallNext = true
  const role = req.headers.role
  if (role == null) {
    res.status(401).send({ statusCode: 401, message: 'Unauthorized', details: 'Role is required.' })
    isAbleToCallNext = false
  }
  if (!roles.includes(role as Role)) {
    res.status(403).send({ statusCode: 403, message: 'Forbidden', details: 'Access denied.' })
    isAbleToCallNext = false
  }
  if (isAbleToCallNext) {
    next()
  }
}

export { routeAuthMiddleware }
