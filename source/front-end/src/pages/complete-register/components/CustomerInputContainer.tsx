import useAppSelector from '../../../hooks/use-app-selector'
import { Input } from '../../../components/inputs/Input'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { CustomerSchemas } from '../../../utils/validation/zod-schemas/customer.zod-schemas.validation.util'
import { Button } from '../../../components/button/Button'
import {
  CustomerCompleteRegisterFormData,
  OnSubmitProfessionalOrCustomerForm,
} from '../types'
import { Formatter } from '../../../utils/formatter/formatter.util'
import { Select } from '../../../components/inputs/Select'
import NotificationPreferenceSelect from '../../../components/inputs/NotificationPreferenceSelect'

interface CustomerInputContainerProps {
  isLoading: boolean
  handleSubmit: OnSubmitProfessionalOrCustomerForm
}

const DISCOVERY_OPTIONS = [
  { value: 'INSTAGRAM', label: 'Instagram' },
  { value: 'FACEBOOK', label: 'Facebook' },
  { value: 'TIKTOK', label: 'TikTok' },
  { value: 'GOOGLE', label: 'Google' },
  { value: 'WHATSAPP', label: 'WhatsApp' },
  { value: 'WALK_IN', label: 'Passou na frente / balcão' },
  { value: 'OTHER', label: 'Outro' },
]

// TODO: Separate Social Media to a Component

function CustomerInputContainer(props: CustomerInputContainerProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CustomerCompleteRegisterFormData>({
    resolver: zodResolver(CustomerSchemas.customerCompleteRegisterBodySchema),
  })

  const user = useAppSelector((state) => state.auth.user!)

  return (
    <form
      className="flex flex-col gap-10 w-full"
      onSubmit={handleSubmit(props.handleSubmit)}
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
      <Select
        registration={{ ...register('discoverySource') }}
        id="discoverySource"
        label="Como você conheceu o salão?"
        options={DISCOVERY_OPTIONS}
        error={errors?.discoverySource?.message?.toString()}
        variant="outline"
        wrapperClassName="w-full"
      />
      <NotificationPreferenceSelect
        register={register}
        error={errors.notificationPreference}
      />
      <Input
        label="Email"
        id="email"
        type="email"
        value={user.email}
        disabled
      />
      <Button
        type="submit"
        label={
          props.isLoading ? (
            <div className="flex justify-center items-center gap-4">
              <div className="w-4 h-4 border-2 border-t-2 border-transparent border-t-white rounded-full animate-spin"></div>
              <p className="text-sm">Finalizar cadastro</p>
            </div>
          ) : (
            'Finalizar cadastro'
          )
        }
        disabled={props.isLoading}
      />
    </form>
  )
}

export default CustomerInputContainer
