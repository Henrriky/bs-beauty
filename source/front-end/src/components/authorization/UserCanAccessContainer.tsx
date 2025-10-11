import { useUserCanAccess } from '../../hooks/authorization/use-user-can-access'
import { UserCanAccessProps } from '../../utils/authorization/authorization.utils'

interface UserCanAccessContainerProps extends Omit<UserCanAccessProps, 'user'> {
  children: React.ReactNode
  fallback?: React.ReactNode
}

export function UserCanAccessContainer({
  children,
  allowedPermissions,
  allowedUserTypes,
  fallback,
  strategy = 'ALL',
}: UserCanAccessContainerProps) {
  const canAccess = useUserCanAccess({
    allowedPermissions,
    allowedUserTypes,
    strategy,
  })

  if (!canAccess) {
    return fallback ?? null
  }

  return <>{children}</>
}
