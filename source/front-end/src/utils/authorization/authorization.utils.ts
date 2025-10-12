import { CustomerOrProfessional, UserType } from '../../store/auth/types'
import { Permissions } from '../../types/authorization'

export const userHasTypeAccess = (
  allowedUserTypes: UserType[],
  currentUserType: UserType,
) => {
  return allowedUserTypes.includes(currentUserType)
}

type UserHasPermissionStrategy = 'ALL' | 'ANY'
export const userHasPermission = (
  allowedPermissions: Permissions[],
  userPermissions: Permissions[],
  strategy: UserHasPermissionStrategy = 'ALL',
) => {
  if (strategy === 'ALL') {
    return allowedPermissions.every((permission) =>
      userPermissions.includes(permission),
    )
  }

  if (strategy === 'ANY') {
    return allowedPermissions.some((permission) =>
      userPermissions.includes(permission),
    )
  }

  return false
}

type UserCanAccessStrategy = 'ANY' | 'ALL'
export interface UserCanAccessProps {
  user: CustomerOrProfessional
  allowedUserTypes?: UserType[]
  allowedPermissions?: Permissions[]
  strategy?: UserCanAccessStrategy
}
export const userCanAccess = ({
  user,
  allowedUserTypes = [],
  allowedPermissions = [],
  strategy = 'ALL',
}: UserCanAccessProps) => {
  const { permissions = [], userType } = user

  const isAllowedPermissionsEmpty = allowedPermissions.length === 0
  const isAllowedUserTypesEmpty = allowedUserTypes.length === 0

  if (isAllowedPermissionsEmpty && isAllowedUserTypesEmpty) return true

  const isUserPermissionsEmpty = permissions.length === 0

  if (!isUserPermissionsEmpty) {
    return userHasPermission(allowedPermissions, permissions, strategy)
  }

  const userHasUserTypeAccess = userHasTypeAccess(allowedUserTypes, userType)

  return userHasUserTypeAccess
}
