/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck

import { toast } from 'react-toastify'
import * as AuthAPI from '../../api/auth-api'
import BSBeautyLoading from '../../components/feedback/Loading'
import Title from '../../components/texts/Title'
import useAppDispatch from '../../hooks/use-app-dispatch'
import useAppSelector from '../../hooks/use-app-selector'
import { authAPI } from '../../store/auth/auth-api'
import { setToken } from '../../store/auth/auth-slice'
import { UserType } from '../../store/auth/types'
import { decodeUserToken } from '../../utils/decode-token'
import CustomerProfile from './components/CustomerProfile'
import EmployeeProfile from './components/EmployeeProfile'
import ProfilePicture from './components/ProfilePicture'

const userTypeToProfileComponents = {
  [UserType.CUSTOMER]: CustomerProfile,
  [UserType.EMPLOYEE]: EmployeeProfile,
  [UserType.MANAGER]: EmployeeProfile,
}

function Profile() {
  const dispatchRedux = useAppDispatch()
  const user = useAppSelector((state) => state.auth.user!)
  const tokens = useAppSelector((state) => state.auth.token)

  const { data, isLoading, isError, error } = authAPI.useFetchUserInfoQuery()

  async function handleUpdateProfileToken() {
    if (!tokens?.googleAccessToken) {
      toast.error('Token de acesso inválido')
      return
    }

    try {
      const { accessToken } = await AuthAPI.loginWithGoogleAccessToken(
        tokens.googleAccessToken,
      )

      const decodedToken = decodeUserToken(accessToken)

      dispatchRedux(
        setToken({
          user: {
            id: decodedToken.id,
            userType: decodedToken.userType,
            email: decodedToken.email,
            name: decodedToken.name,
            registerCompleted: decodedToken.registerCompleted,
            profilePhotoUrl: decodedToken.profilePhotoUrl,
          },
          token: {
            googleAccessToken: tokens.googleAccessToken,
            accessToken,
            expiresAt: decodedToken.exp!,
          },
        }),
      )

      localStorage.setItem('token', accessToken)
      dispatchRedux(authAPI.util.invalidateTags(['User']))
    } catch (err) {
      console.error('Erro ao atualizar token:', err)
      toast.error('Erro ao atualizar token')
    }
  }

  if (isLoading) {
    return <BSBeautyLoading title="Carregando as informações..." />
  }

  if (isError) {
    toast.error('Erro ao carregar informações do usuário')
    console.error(error)

    return (
      <div className="flex justify-center items-center h-full text-red-500">
        Erro ao carregar informações. Tente novamente mais tarde.
      </div>
    )
  }

  if (!data) {
    toast.warn('Informações não disponíveis no momento')
    return (
      <div className="flex justify-center items-center h-full text-yellow-500">
        Nenhuma informação disponível.
      </div>
    )
  }

  const ProfileContainer = userTypeToProfileComponents[user.userType]
  const userInfo = data.user

  return (
    <div className="h-full flex flex-col justify-between">
      <div>
        <div className="flex flex-col gap-4 mb-6">
          <Title align="left">Perfil</Title>
          <ProfilePicture profilePhotoUrl={user.profilePhotoUrl} />
          <ProfileContainer
            userInfo={userInfo}
            onProfileUpdate={handleUpdateProfileToken}
          />
        </div>
      </div>
    </div>
  )
}

export default Profile
