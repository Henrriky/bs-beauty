import { Navigate, Outlet } from 'react-router'
import useAppSelector from '../../hooks/use-app-selector'

function PrivateRoute() {
  const user = useAppSelector((state) => state.auth.token)

  return user ? <Outlet /> : <Navigate to={'/login'} replace />
}

export default PrivateRoute
