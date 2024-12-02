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

function Profile() {
  const user = useAppSelector((state) => state.auth.user!)

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
          <ProfilePicture />
        </div>
        <form
          className="flex flex-col gap-10 w-full"
          // onSubmit={handleSubmit(props.handleSubmit)}
        >
          <Input
            registration={{ ...register('name') }}
            label="Nome"
            id="name"
            type="text"
            placeholder="Digite seu nome"
            error={errors?.name?.message?.toString()}
            value={user.name || ''}
          />
          <Input
            registration={{
              ...register('birthdate', {
                onChange: (e) => {
                  const value = Formatter.formatBirthdayWithSlashes(
                    e.target.value,
                  )
                  e.target.value = value
                },
              }),
            }}
            label="Data de nascimento"
            id="birthdate"
            type="text"
            placeholder="Digite sua data de nascimento"
            error={errors?.birthdate?.message?.toString()}
            value={'18/03/2005'}
          />
          <Input
            registration={{
              ...register('phone', {
                onChange: (e) => {
                  const value = Formatter.formatPhoneNumber(e.target.value)
                  e.target.value = value
                },
              }),
            }}
            label="Telefone"
            id="phone"
            type="text"
            placeholder="Digite seu telefone"
            error={errors?.phone?.message?.toString()}
            value={'11954056219'}
          />
          <Input
            label="Email"
            id="email"
            type="email"
            value={user.email}
            disabled
          />
        </form>
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
