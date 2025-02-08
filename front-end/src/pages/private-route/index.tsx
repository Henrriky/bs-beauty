import { Navigate, Outlet } from 'react-router'
import useAppSelector from '../../hooks/use-app-selector'
import { Role } from '../../store/auth/types'
import { toast } from 'react-toastify'
import { userHasPermission } from '../../utils/authorization/user-has-permission'

interface PrivateRouteProps {
  allowedRoles: Role[]
}

function PrivateRoute({ allowedRoles }: PrivateRouteProps) {
  const currentUserAuthInformations = useAppSelector((state) => state.auth)

  if (!currentUserAuthInformations?.token)
    return <Navigate to={'/login'} replace />

  const userRole = currentUserAuthInformations.user?.role
  const currentUserHasPermission =
    userRole && userHasPermission(allowedRoles, userRole)

  if (!currentUserHasPermission) {
    toast.warn('Você não tem permissão para acessar esta página.')
    return <Navigate to={'/home'} replace />
  }

  return <Outlet />
}

export default PrivateRoute
