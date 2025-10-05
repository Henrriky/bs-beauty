import { PermissionChecker } from '@/utils/auth/permission-checker.util'
import { type Permissions } from '@/utils/auth/permissions-map.util'
import { AppErrorCodes } from '@/utils/errors/app-error-codes'
import { AppLoggerInstance } from '@/utils/logger/logger.util'
import { type UserType } from '@prisma/client'
import { type NextFunction, type Request, type Response } from 'express'

export const combinedAuthMiddleware = (
  allowedUserTypes: UserType[],
  requiredPermissions: Permissions[]
) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const { userType, permissions } = req.user

    const isValidUserType = allowedUserTypes.includes(userType as UserType)
    const isValidPermission = permissions.length > 0 && requiredPermissions.length > 0 && requiredPermissions.every(requiredPermission =>
      PermissionChecker.hasPermission(permissions, requiredPermission)
    )
    const isAuthorized = isValidUserType || isValidPermission

    if (!isAuthorized) {
      AppLoggerInstance.info('User not authorized to access this resource', {
        userId: req.user.id,
        userType: req.user.userType,
        permissions,
        route: req.originalUrl,
        method: req.method
      })
      res.status(403).send({ statusCode: 403, message: 'Forbidden', details: AppErrorCodes.INSUFFICIENT_PERMISSIONS })
      return
    }

    next()
  }
}
