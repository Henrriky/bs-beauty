import { Navigate, Outlet } from 'react-router'
import useAppSelector from '../../hooks/use-app-selector'
import { UserType } from '../../store/auth/types'
import { toast } from 'react-toastify'
import { userHasPermission } from '../../utils/authorization/user-has-permission'

interface PrivateRouteProps {
  allowedUserTypes: UserType[]
}

function PrivateRoute({ allowedUserTypes }: PrivateRouteProps) {
  const currentUserAuthInformations = useAppSelector((state) => state.auth)

  if (!currentUserAuthInformations?.token)
    return <Navigate to={'/login'} replace />

  const userType = currentUserAuthInformations.user?.userType
  const currentUserHasPermission =
    userType && userHasPermission(allowedUserTypes, userType)

  if (!currentUserHasPermission) {
    toast.warn('Você não tem permissão para acessar esta página.')
    return <Navigate to={'/home'} replace />
  }

  return <Outlet />
}

export default PrivateRoute
