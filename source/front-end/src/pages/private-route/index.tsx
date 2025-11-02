import { Navigate, Outlet } from 'react-router'
import useAppSelector from '../../hooks/use-app-selector'
import { UserCanAccessContainer } from '../../components/authorization/UserCanAccessContainer'
import { UserCanAccessProps } from '../../utils/authorization/authorization.utils'

type PrivateRouteProps = Omit<UserCanAccessProps, 'user'>

function PrivateRoute({
  allowedUserTypes,
  allowedPermissions,
  strategy,
}: PrivateRouteProps) {
  const currentUserAuthInformations = useAppSelector((state) => state.auth)

  if (!currentUserAuthInformations?.token)
    return <Navigate to={'/login'} replace />

  return (
    <UserCanAccessContainer
      allowedPermissions={allowedPermissions}
      allowedUserTypes={allowedUserTypes}
      strategy={strategy}
      fallback={<Navigate to={'/home'} replace />}
    >
      <Outlet />
    </UserCanAccessContainer>
  )
}

export default PrivateRoute
