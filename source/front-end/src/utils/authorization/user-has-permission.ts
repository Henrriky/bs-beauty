import { UserType } from '../../store/auth/types'

export const userHasPermission = (allowedUserTypes: UserType[], currentUserType: UserType) => {
  return allowedUserTypes.includes(currentUserType)
}
