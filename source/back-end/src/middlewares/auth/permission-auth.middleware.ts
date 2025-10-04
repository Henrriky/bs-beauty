import { PermissionChecker } from '@/utils/auth/permission-checker.util'
import { type Permissions } from '@/utils/auth/permissions-map.util'
import { CustomError } from '@/utils/errors/custom.error.util'
import { type Request, type Response, type NextFunction } from 'express'

export const permissionAuthMiddleware = (requiredPermissions: Permissions[]) => {
  return async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    try {
      const { permissions: userPermissions } = req.user

      const hasPermission = requiredPermissions.every(requiredPermission =>
        PermissionChecker.hasPermission(userPermissions, requiredPermission)
      )

      if (!hasPermission) {
        throw new CustomError('Insufficient permissions', 403)
      }

      next()
    } catch (error) {
      next(error)
    }
  }
}
