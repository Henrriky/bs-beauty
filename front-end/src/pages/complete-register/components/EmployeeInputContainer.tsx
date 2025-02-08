import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, useFieldArray } from 'react-hook-form'

import useAppSelector from '../../../hooks/use-app-selector'

import { Input } from '../../../components/inputs/Input'
import { Button } from '../../../components/button/Button'

import {
  EmployeeCompleteRegisterFormData,
  OnSubmitEmployeeOrCustomerForm,
} from '../types'
import { EmployeeSchemas } from '../../../utils/validation/zod-schemas/employee.zod-schemas.validation.utils'
import { Formatter } from '../../../utils/formatter/formatter.util'
import SocialMediaContainerInput from '../../../components/inputs/social-media-input/SocialMediaContainerInput'

interface EmployeeInputContainerProps {
  isLoading: boolean
  handleSubmit: OnSubmitEmployeeOrCustomerForm
}

function EmployeeInputContainer(props: EmployeeInputContainerProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<EmployeeCompleteRegisterFormData>({
    resolver: zodResolver(EmployeeSchemas.employeeCompleteRegisterBodySchema),
  })

  const user = useAppSelector((state) => state.auth.user!)
  const {
    fields: socialMediaFields,
    append: appendNewSocialMedia,
    remove: removeSocialMedia,
  } = useFieldArray({
    control,
    name: 'socialMedia',
  })

  return (
    <form
      className="flex flex-col gap-10 w-full"
      onSubmit={handleSubmit(props.handleSubmit)}
    >
      <Input
        label="Nome"
        id="name"
        type="text"
        placeholder="Digite seu nome"
        registration={{ ...register('name') }}
        error={errors?.name?.message?.toString()}
      />
      <Input
        registration={{
          ...register('contact', {
            onChange: (e) => {
              const value = Formatter.formatPhoneNumber(e.target.value)
              e.target.value = value
            },
          }),
        }}
        label="Telefone de contato"
        id="contact"
        type="contact"
        placeholder="Digite seu telefone de contato"
        error={errors?.contact?.message?.toString()}
      />
      <Input
        label="Email"
        id="email"
        type="email"
        value={user.email}
        disabled
      />
      <SocialMediaContainerInput
        socialMediaFields={socialMediaFields}
        removeSocialMedia={removeSocialMedia}
        register={register}
        errors={errors}
        appendNewSocialMedia={appendNewSocialMedia}
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
