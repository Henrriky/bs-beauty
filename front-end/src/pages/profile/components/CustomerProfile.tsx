import { useForm } from 'react-hook-form'
import { Input } from '../../../components/inputs/Input'
import { CustomerUpdateProfileFormData } from './types'
import { zodResolver } from '@hookform/resolvers/zod'
import { CustomerSchemas } from '../../../utils/validation/zod-schemas/customer.zod-schemas.validation.util'
import { Formatter } from '../../../utils/formatter/formatter.util'
import { Customer } from '../../../store/auth/types'
import useAppDispatch from '../../../hooks/use-app-dispatch'
import { updateUserInformations } from '../../../store/auth/auth-slice'
import { toast } from 'react-toastify'
import { Button } from '../../../components/button/Button'
import { userAPI } from '../../../store/user/user-api'

interface CustomerProfileProps {
  userInfo: Customer
}

function CustomerProfile({ userInfo }: CustomerProfileProps) {
  const dispatchRedux = useAppDispatch()
  const [updateProfile, { isLoading }] = userAPI.useUpdateProfileMutation()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CustomerUpdateProfileFormData>({
    resolver: zodResolver(CustomerSchemas.updateSchema),
    defaultValues: {
      birthdate: userInfo.birthdate
        ? ((() => {
            const date = new Date(userInfo.birthdate)
            const day = String(date.getUTCDate()).padStart(2, '0')
            const month = String(date.getMonth() + 1).padStart(2, '0')
            const year = date.getFullYear()
            return `${day}/${month}/${year}`
          })() as unknown as Date)
        : undefined,
      phone: userInfo.phone || undefined,
      name: userInfo.name || undefined,
      email: userInfo.email || undefined,
    },
  })

  const handleSubmitConcrete = async (data: CustomerUpdateProfileFormData) => {
    await updateProfile({
      userId: userInfo.id,
      profileData: data,
    })
      .unwrap()
      .then(() => {
        dispatchRedux(
          updateUserInformations({
            user: {
              name: data.name,
              email: data.email,
            },
          }),
        )
        toast.success('Perfil atualizado com sucesso!')
      })
      .catch((error: unknown) => {
        console.error('Error trying to complete register', error)
        toast.error('Ocorreu um erro ao atualizar o perfil')
      })
  }

  return (
    <form
      className="flex flex-col gap-10 w-full"
      onSubmit={handleSubmit(handleSubmitConcrete)}
    >
      <Input
        registration={{ ...register('name') }}
        label="Nome"
        id="name"
        type="text"
        placeholder="Digite seu nome"
        error={errors?.name?.message?.toString()}
      />
      <Input
        registration={{
          ...register('birthdate', {
            onChange: (e) => {
              const value = Formatter.formatBirthdayWithSlashes(e.target.value)
              e.target.value = value
            },
          }),
        }}
        label="Data de nascimento"
        id="birthdate"
        type="text"
        placeholder="Digite sua data de nascimento"
        error={errors?.birthdate?.message?.toString()}
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
      />
      <Input
        registration={{ ...register('email') }}
        label="Email"
        id="email"
        type="email"
        value={userInfo.email}
        disabled
      />
      <Button
        type="submit"
        label={
          isLoading ? (
            <div className="flex justify-center items-center gap-4">
              <div className="w-4 h-4 border-2 border-t-2 border-transparent border-t-white rounded-full animate-spin"></div>
              <p className="text-sm">Salvar</p>
            </div>
          ) : (
            'Salvar'
          )
        }
        disabled={isLoading}
      />
    </form>
  )
}

export default CustomerProfile
