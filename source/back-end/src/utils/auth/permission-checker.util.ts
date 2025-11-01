import { type Permissions } from './permissions-map.util'

export class PermissionChecker {
  public static hasPermission (
    userPermissions: Permissions[],
    requiredPermission: Permissions
  ): boolean {
    return userPermissions.includes(requiredPermission)
  }
}
