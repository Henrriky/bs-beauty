import useAppSelector from '../../../hooks/use-app-selector'
import { Input } from '../../../components/inputs/Input'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Button } from '../../../components/button/Button'
import {
  CustomerCompleteRegisterFormData,
  // EmployeeCompleteRegisterFormData,
  OnSubmitEmployeeOrCustomerForm,
} from './types'
import { EmployeeSchemas } from '../../../utils/validation/zod-schemas/employee.zod-schemas.validation.utils'

interface EmployeeInputContainerProps {
  isLoading: boolean
  handleSubmit: OnSubmitEmployeeOrCustomerForm
}

function EmployeeInputContainer(props: EmployeeInputContainerProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CustomerCompleteRegisterFormData>({
    resolver: zodResolver(EmployeeSchemas.employeeCompleteRegisterBodySchema),
  })
  const user = useAppSelector((state) => state.auth.user!)

  return (
    <form
      className="flex flex-col gap-10 w-full"
      onSubmit={handleSubmit(props.handleSubmit)}
    >
      <Input
        {...register('name')}
        label="Nome"
        id="name"
        type="text"
        placeholder="Digite seu nome"
        error={errors?.name?.message?.toString()}
      />
      <Input
        {...register('birthdate')}
        label="Data de nascimento"
        id="birthdate"
        type="text"
        placeholder="Digite sua data de nascimento"
        error={errors?.birthdate?.message?.toString()}
      />
      <Input
        {...register('phone')}
        label="Telefone"
        id="phone"
        type="text"
        placeholder="Digite seu telefone"
        error={errors?.phone?.message?.toString()}
      />
      <Input
        label="Email"
        name="email"
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

export default EmployeeInputContainer
