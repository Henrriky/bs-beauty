import { Role } from '../../store/auth/types'

export const userHasPermission = (allowedRoles: Role[], currentRole: Role) => {
  return allowedRoles.includes(currentRole)
}
