/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck

import Subtitle from '../../components/texts/Subtitle'
import useAppSelector from '../../hooks/use-app-selector'
import ProfilePicture from './components/ProfilePicture'
import { authAPI } from '../../store/auth/auth-api'
import { toast } from 'react-toastify'
import CustomerProfile from './components/CustomerProfile'
import { Role } from '../../store/auth/types'
import EmployeeProfile from './components/EmployeeProfile'

const roleToProfileComponents = {
  [Role.CUSTOMER]: CustomerProfile,
  [Role.EMPLOYEE]: EmployeeProfile,
  [Role.MANAGER]: EmployeeProfile,
}

function Profile() {
  const user = useAppSelector((state) => state.auth.user!)

  const { data, isLoading, isError, error } = authAPI.useFetchUserInfoQuery()
  if (isLoading) {
    return <div>Carregando...</div>
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

  const ProfileContainer = roleToProfileComponents[user.role]
  const userInfo = data.user

  return (
    <div className="h-full flex flex-col justify-between">
      <div>
        <div className="flex flex-col gap-4 mb-6">
          <Subtitle align="left" color="primary-golden">
            Perfil
          </Subtitle>
          <ProfilePicture profilePhotoUrl={user.profilePhotoUrl} />
          <ProfileContainer userInfo={userInfo} />
        </div>
      </div>
    </div>
  )
}

export default Profile
