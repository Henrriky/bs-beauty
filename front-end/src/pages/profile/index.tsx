import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from '../../components/inputs/Input'
import Subtitle from '../../components/texts/Subtitle'
import useAppSelector from '../../hooks/use-app-selector'
import { CustomerSchemas } from '../../utils/validation/zod-schemas/customer.zod-schemas.validation.util'
import { CustomerCompleteRegisterFormData } from '../complete-register/components/types'
import ProfilePicture from './components/ProfilePicture'
import { useForm } from 'react-hook-form'
import { Formatter } from '../../utils/formatter/formatter.util'
import { Button } from '../../components/button/Button'
import { authAPI } from '../../store/auth/auth-api'
import { toast } from 'react-toastify'

function Profile() {
  const user = useAppSelector((state) => state.auth.user!)

  const { data, isLoading, isError } = authAPI.useFetchUserInfoQuery()

  if (isLoading) {
    return <div>Carregando...</div>
  }

  if (isError) {
    toast.error('Erro ao carregar informações do usuário')
  }

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CustomerCompleteRegisterFormData>({
    resolver: zodResolver(CustomerSchemas.customerCompleteRegisterBodySchema),
  })

  return (
    <div className="h-full flex flex-col justify-between">
      <div>
        <div className="flex flex-col gap-4 mb-6">
          <Subtitle align="left" color="primary-golden">
            Perfil
          </Subtitle>
          <ProfilePicture profilePhotoUrl={user.profilePhotoUrl} />
        </div>
      </div>
      <Button
        type="submit"
        // label={props.isLoading ? (
        //   <div className="flex justify-center items-center gap-4">
        //     <div className="w-4 h-4 border-2 border-t-2 border-transparent border-t-white rounded-full animate-spin"></div>
        //     <p className="text-sm">Finalizar cadastro</p>
        //   </div>
        // ) : (
        //   'Finalizar cadastro'
        // )}
        label={'Salvar'}
        className="mt-8"
        // disabled={props.isLoading}
      />
    </div>
  )
}

export default Profile
