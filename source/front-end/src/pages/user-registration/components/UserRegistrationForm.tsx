import { useForm } from 'react-hook-form'
import {
  CustomerRegistrationFormData,
  OnSubmitCustomerRegistrationFormData,
  OnSubmitProfessionalRegistrationFormData,
} from '../types'
import { zodResolver } from '@hookform/resolvers/zod'
import { CustomerSchemas } from '../../../utils/validation/zod-schemas/customer.zod-schemas.validation.util'
import { Input } from '../../../components/inputs/Input'
import { Button } from '../../../components/button/Button'
import PasswordEyeIcon from '../../../components/password/PasswordEyeIcon'
import { useState } from 'react'

interface UserRegistrationProps {
  isLoading: boolean
  handleSubmit:
    | OnSubmitCustomerRegistrationFormData
    | OnSubmitProfessionalRegistrationFormData
  setEmail: React.Dispatch<React.SetStateAction<string>>
  setPassword: React.Dispatch<React.SetStateAction<string>>
  isOpen: boolean
}

function UserRegistrationForm(props: UserRegistrationProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CustomerRegistrationFormData>({
    resolver: zodResolver(CustomerSchemas.registerCustomerBodySchema),
  })

  const [showPassword, setShowPassword] = useState(false)

  const handleEmailInputChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    props.setEmail(event.target.value)
  }

  const handlePasswordInputChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    props.setPassword(event.target.value)
  }

  return (
    <form
      className="flex flex-col gap-10 w-full"
      onSubmit={handleSubmit(props.handleSubmit)}
    >
      <Input
        registration={{ ...register('email') }}
        label="E-mail"
        id="email"
        type="email"
        placeholder="Digite seu e-mail"
        error={errors?.email?.message?.toString()}
        onChange={handleEmailInputChange}
      />
      <div className="relative">
        <Input
          registration={{ ...register('password') }}
          label="Senha"
          id="password"
          type={showPassword ? 'text' : 'password'}
          placeholder="Digite sua senha"
          error={errors?.password?.message?.toString()}
          onChange={handlePasswordInputChange}
        />
        <PasswordEyeIcon
          showPassword={showPassword}
          showPasswordFunction={() => setShowPassword(!showPassword)}
        />
      </div>
      <div className="relative">
        <Input
          registration={{ ...register('confirmPassword') }}
          label="Confirmação da Senha"
          id="confirm-password"
          type={showPassword ? 'text' : 'password'}
          placeholder="Digite sua senha novamente"
          error={errors?.confirmPassword?.message?.toString()}
        />
        <PasswordEyeIcon
          showPassword={showPassword}
          showPasswordFunction={() => setShowPassword(!showPassword)}
        />
      </div>
      <Button
        type="submit"
        label={
          props.isLoading && !props.isOpen ? (
            <div className="flex justify-center items-center gap-4">
              <div className="w-4 h-4 border-2 border-t-2 border-transparent border-t-white rounded-full animate-spin"></div>
              <p className="text-sm">Carregando...</p>
            </div>
          ) : (
            'Prosseguir para próxima etapa'
          )
        }
        disabled={props.isLoading}
      />
    </form>
  )
}

export default UserRegistrationForm
