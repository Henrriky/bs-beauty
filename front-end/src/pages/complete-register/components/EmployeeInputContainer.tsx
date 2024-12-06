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
import { PlusIcon } from '@heroicons/react/16/solid'
import { getErrorMessageFromErrorsAttr } from '../../../utils/react-hook-form/get-error-message-from-errors-attr'
import { ErrorMessage } from '../../../components/feedback/ErrorMessage'
import { TrashIcon } from '@heroicons/react/24/outline'
import { Formatter } from '../../../utils/formatter/formatter.util'

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
      <div className="flex gap-3 flex-col items-start">
        <label className="text-sm text-[#D9D9D9]" htmlFor="socialMedia">
          Redes sociais
        </label>
        <Button
          type="button"
          variant="outline"
          disabled={socialMediaFields.length >= 5}
          outlineVariantBorderStyle="dashed"
          onClick={() => appendNewSocialMedia({ name: '', url: '' })}
          label={
            <div className="flex justify-center items-center gap-1">
              <PlusIcon className="size-5" />
              <p className="text-sm">
                {socialMediaFields.length >= 5
                  ? 'Limite atingido'
                  : 'Clique para uma nova'}
              </p>
            </div>
          }
        />
        {errors?.socialMedia?.message && (
          <ErrorMessage message={errors.socialMedia.message} />
        )}
        <div className="pl-4 w-full max-h-80 overflow-y-scroll scroll">
          {socialMediaFields.map((field, index) => {
            const socialMediaNameField =
              `socialMedia.${index}.name` as `socialMedia.${number}.name`
            const socialMediaUrlField =
              `socialMedia.${index}.url` as `socialMedia.${number}.url`

            return (
              <div
                key={field.id}
                className="flex mt-4 gap-2 justify-start items-center"
              >
                <div className="flex gap-2 w-full">
                  <Input
                    registration={{ ...register(socialMediaNameField) }}
                    id={socialMediaNameField}
                    type="text"
                    placeholder="Nome da rede social"
                    variant="solid"
                    error={getErrorMessageFromErrorsAttr(
                      errors,
                      socialMediaNameField,
                    )}
                    wrapperClassName="w-full"
                  />
                  <Input
                    registration={{ ...register(socialMediaUrlField) }}
                    id={socialMediaUrlField}
                    type="text"
                    placeholder="Link da rede social"
                    variant="solid"
                    error={getErrorMessageFromErrorsAttr(
                      errors,
                      socialMediaUrlField,
                    )}
                    wrapperClassName="w-full"
                  />
                </div>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => removeSocialMedia(index)}
                  label={
                    <div className="flex justify-center items-center gap-1">
                      <TrashIcon className="size-6" />
                    </div>
                  }
                  disabled={props.isLoading}
                  className="max-w-10 border-none hover:text-[#B19B86] rounded-none hover:bg-opacity-0 hover:bg-transparent"
                />
              </div>
            )
          })}
        </div>
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
            'Finalizar cadastro'
          )
        }
        disabled={props.isLoading}
      />
    </form>
  )
}

export default EmployeeInputContainer
