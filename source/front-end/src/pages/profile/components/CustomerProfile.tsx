import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { Button } from '../../../components/button/Button'
import { Input } from '../../../components/inputs/Input'
import { Customer } from '../../../store/auth/types'
import { userAPI } from '../../../store/user/user-api'
import { Formatter } from '../../../utils/formatter/formatter.util'
import { CustomerSchemas } from '../../../utils/validation/zod-schemas/customer.zod-schemas.validation.util'
import { CustomerUpdateProfileFormData } from './types'
import { Checkbox } from '../../../components/inputs/Checkbox'
import Modal from '../../services/components/Modal'
import { useState } from 'react'
import Subtitle from '../../../components/texts/Subtitle'
import ExclamationMarkIcon from '../../../../src/assets/exclamation-mark.svg'
import { useDispatch } from 'react-redux'
import { customerAPI } from '../../../store/customer/customer-api'

interface CustomerProfileProps {
  userInfo: Customer
  onProfileUpdate: () => void
}

function CustomerProfile({ userInfo, onProfileUpdate }: CustomerProfileProps) {
  const [updateProfile, { isLoading }] = userAPI.useUpdateProfileMutation()
  const dispatch = useDispatch()

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
      alwaysAllowImageUse: userInfo.alwaysAllowImageUse ?? undefined,
    },
  })

  const handleSubmitConcrete = async (data: CustomerUpdateProfileFormData) => {
    await updateProfile({
      userId: userInfo.id,
      profileData: data,
    })
      .unwrap()
      .then(() => {
        toast.success('Perfil atualizado com sucesso!')
        onProfileUpdate()

        dispatch(customerAPI.util.invalidateTags(['Customers']))
      })
      .catch((error: unknown) => {
        console.error('Error trying to complete register', error)
        toast.error('Ocorreu um erro ao atualizar o perfil')
      })
  }

  const [modalIsOpen, setModalIsOpen] = useState<boolean>(false)

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
      <Checkbox
        registration={{
          ...register('alwaysAllowImageUse'),
        }}
        label="Permitir o uso de minha imagem."
        id="alwaysAllowImageUse"
        error={errors?.alwaysAllowImageUse?.message?.toString()}
      />
      <span
        onClick={() => setModalIsOpen(true)}
        className="text-primary-100 hover:text-primary-0 hover:cursor-pointer hover:underline transition-all w-fit"
      >
        O que é isso?
      </span>
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
      <Modal
        className="bg-[#54493F] font-normal relative"
        isOpen={modalIsOpen}
        onClose={() => {
          setModalIsOpen(false)
        }}
      >
        <img
          src={ExclamationMarkIcon}
          alt="Ícone de seta"
          className="absolute -top-[40px] max-w-[150px] max-h-[150px]"
        />
        <div className="flex flex-col items-center justify-between h-full pt-8 pb-4">
          <div className="flex-grow flex items-center justify-center">
            <Subtitle className="text-[#B5B5B5]" align="center">
              A permissão para uso de imagem se refere a permissão de retirar
              fotos durante os procedimentos para divulgar nas redes sociais.
            </Subtitle>
          </div>
          <Button
            className="transition-all bg-[#A4978A] text-[#54493F] font-medium hover:bg-[#4e483f] hover:text-white"
            label={'Ok'}
            id={'agree'}
            onClick={() => {
              setModalIsOpen(false)
            }}
          />
        </div>
      </Modal>
    </form>
  )
}

export default CustomerProfile
