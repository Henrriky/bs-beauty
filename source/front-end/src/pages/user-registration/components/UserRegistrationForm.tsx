import { useForm } from 'react-hook-form'
import {
  CustomerRegistrationFormData,
  OnSubmitCustomerRegistrationFormData,
  OnSubmitEmployeeRegistrationFormData,
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
    | OnSubmitEmployeeRegistrationFormData
  setEmail: React.Dispatch<React.SetStateAction<string>>
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

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    props.setEmail(event.target.value)
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
        onChange={handleInputChange}
      />
      <div className="relative">
        <Input
          registration={{ ...register('password') }}
          label="Senha"
          id="password"
          type={showPassword ? 'text' : 'password'}
          placeholder="Digite sua senha"
          error={errors?.password?.message?.toString()}
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
          props.isLoading ? (
            <div className="flex justify-center items-center gap-4">
              <div className="w-4 h-4 border-2 border-t-2 border-transparent border-t-white rounded-full animate-spin"></div>
              <p className="text-sm">Finalizar cadastro</p>
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
