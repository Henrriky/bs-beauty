import { useMemo } from 'react'
import {
  userCanAccess,
  UserCanAccessProps,
} from '../../utils/authorization/authorization.utils'
import useAppSelector from '../use-app-selector'

type UseUserCanAccessProps = Omit<UserCanAccessProps, 'user'>

export function useUserCanAccess(props: UseUserCanAccessProps) {
  const { user } = useAppSelector((state) => state.auth)

  const canAccess = useMemo(() => {
    if (!user) return false

    return userCanAccess({
      user,
      allowedPermissions: props.allowedPermissions,
      allowedUserTypes: props.allowedUserTypes,
      strategy: props.strategy || 'ALL',
    })
  }, [props.allowedPermissions, props.allowedUserTypes, props.strategy, user])

  return canAccess
}
