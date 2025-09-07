import { zodResolver } from '@hookform/resolvers/zod'
import { useFieldArray, useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { Button } from '../../../components/button/Button'
import { Input } from '../../../components/inputs/Input'
import SocialMediaContainerInput from '../../../components/inputs/social-media-input/SocialMediaContainerInput'
import { Professional } from '../../../store/auth/types'
import { userAPI } from '../../../store/user/user-api'
import { Formatter } from '../../../utils/formatter/formatter.util'
import { ProfessionalSchemas } from '../../../utils/validation/zod-schemas/professional.zod-schemas.validation.utils'
import { ProfessionalUpdateProfileFormData } from '../types'

interface ProfessionalProfileProps {
  userInfo: Professional
  onProfileUpdate: () => void
}

// TODO: Separate Social Media to a Component

function ProfessionalProfile({
  userInfo,
  onProfileUpdate,
}: ProfessionalProfileProps) {
  const [updateProfile, { isLoading }] = userAPI.useUpdateProfileMutation()

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<ProfessionalUpdateProfileFormData>({
    resolver: zodResolver(ProfessionalSchemas.professionalUpdateSchema),
    defaultValues: {
      name: userInfo.name || undefined,
      contact: userInfo.contact || undefined,
      email: userInfo.email || undefined,
      socialMedia: userInfo.socialMedia || undefined,
      specialization: userInfo.specialization || undefined,
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

  const handleSubmitConcrete = async (
    data: ProfessionalUpdateProfileFormData,
  ) => {
    await updateProfile({
      userId: userInfo.id,
      profileData: data,
    })
      .unwrap()
      .then(() => {
        toast.success('Perfil atualizado com sucesso!')
        onProfileUpdate()
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
        registration={{ ...register('specialization') }}
        label="Especialização"
        id="specialization"
        type="specialization"
        placeholder="Digite sua especialização"
      />
      <Input
        registration={{ ...register('email') }}
        label="Email"
        id="email"
        type="email"
        disabled
      />
      <Input
        label="Função"
        id="userType"
        type="userType"
        value={userInfo.userType === 'MANAGER' ? 'Gerente' : 'Funcionario'}
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
          isLoading ? (
            <div className="flex justify-center items-center gap-4">
              <div className="w-4 h-4 border-2 border-t-2 border-transparent border-t-white rounded-full animate-spin"></div>
              <p className="text-sm">Salvar</p>
            </div>
          ) : (
            'Salvar'
          )
        }
        className=""
        disabled={isLoading}
      />
    </form>
  )
}

export default ProfessionalProfile
