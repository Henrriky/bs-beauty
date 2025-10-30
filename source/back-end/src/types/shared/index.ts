import { type Permissions } from '@/utils/auth/permissions-map.util'
import { type UserType } from '@prisma/client'

export interface AuthInformations {
  userId: string
  userType: UserType
  permissions: Permissions[]
}
export interface AuthContext<T> extends AuthInformations {
  extra: T
}
