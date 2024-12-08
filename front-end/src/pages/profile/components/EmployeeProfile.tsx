import { useFieldArray, useForm } from 'react-hook-form'
import { Input } from '../../../components/inputs/Input'
import { zodResolver } from '@hookform/resolvers/zod'
import { Formatter } from '../../../utils/formatter/formatter.util'
import { Employee } from '../../../store/auth/types'
import useAppDispatch from '../../../hooks/use-app-dispatch'
import { updateUserInformations } from '../../../store/auth/auth-slice'
import { toast } from 'react-toastify'
import { Button } from '../../../components/button/Button'
import { userAPI } from '../../../store/user/user-api'
import { EmployeeUpdateProfileFormData } from '../types'
import { EmployeeSchemas } from '../../../utils/validation/zod-schemas/employee.zod-schemas.validation.utils'
import { ErrorMessage } from '../../../components/feedback/ErrorMessage'
import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline'
import { getErrorMessageFromErrorsAttr } from '../../../utils/react-hook-form/get-error-message-from-errors-attr'
import SocialMediaContainerInput from '../../../components/inputs/social-media-input/SocialMediaContainerInput'

interface EmployeeProfileProps {
  userInfo: Employee
}

// TODO: Separate Social Media to a Component

function EmployeeProfile({ userInfo }: EmployeeProfileProps) {
  const dispatchRedux = useAppDispatch()
  const [updateProfile, { isLoading }] = userAPI.useUpdateProfileMutation()

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<EmployeeUpdateProfileFormData>({
    resolver: zodResolver(EmployeeSchemas.employeeUpdateSchema),
    defaultValues: {
      name: userInfo.name || undefined,
      contact: userInfo.contact || undefined,
      email: userInfo.email || undefined,
      socialMedia: userInfo.socialMedia || undefined,
    },
  })
  const {
    fields: socialMediaFields,
    append: appendNewSocialMedia,
    remove: removeSocialMedia,
  } = useFieldArray({
    control,
    name: 'socialMedia',
  })

  const handleSubmitConcrete = async (data: EmployeeUpdateProfileFormData) => {
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
          ...register('contact', {
            onChange: (e) => {
              const value = Formatter.formatPhoneNumber(e.target.value)
              e.target.value = value
            },
          }),
        }}
        label="Telefone"
        id="contact"
        type="text"
        placeholder="Digite seu telefone"
        error={errors?.contact?.message?.toString()}
      />
      <Input
        registration={{ ...register('email') }}
        label="Email"
        id="email"
        type="email"
        disabled
      />
      <SocialMediaContainerInput
        socialMediaFields={socialMediaFields}
        removeSocialMedia={removeSocialMedia}
        register={register}
        errors={errors}
        appendNewSocialMedia={appendNewSocialMedia}
      />
      {/* <div className="flex gap-3 flex-col items-start">
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
                  disabled={isLoading}
                  className="max-w-10 border-none hover:text-[#B19B86] rounded-none hover:bg-opacity-0 hover:bg-transparent"
                />
              </div>
            )
          })}
        </div>
      </div> */}
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
        className="mt-8"
        disabled={isLoading}
      />
    </form>
  )
}

export default EmployeeProfile
