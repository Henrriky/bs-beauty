import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, useFieldArray } from 'react-hook-form'

import useAppSelector from '../../../hooks/use-app-selector'

import { Input } from '../../../components/inputs/Input'
import { Button } from '../../../components/button/Button'

import {
  ProfessionalCompleteRegisterFormData,
  OnSubmitProfessionalOrCustomerForm,
} from '../types'
import { ProfessionalSchemas } from '../../../utils/validation/zod-schemas/professional.zod-schemas.validation.utils'
import { Formatter } from '../../../utils/formatter/formatter.util'
import SocialMediaContainerInput from '../../../components/inputs/social-media-input/SocialMediaContainerInput'
import NotificationPreferenceSelect from '../../../components/inputs/NotificationPreferenceSelect'
import { useState } from 'react'
import PrivacyPolicyCheckbox from './PrivacyPolicyCheckbox'

interface ProfessionalInputContainerProps {
  isLoading: boolean
  handleSubmit: OnSubmitProfessionalOrCustomerForm
}

function ProfessionalInputContainer(props: ProfessionalInputContainerProps) {
  const [acceptedPrivacyPolicy, setAcceptedPrivacyPolicy] = useState(false)
  const [privacyPolicyError, setPrivacyPolicyError] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<ProfessionalCompleteRegisterFormData>({
    resolver: zodResolver(
      ProfessionalSchemas.professionalCompleteRegisterBodySchema,
    ),
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

  const onSubmit = (data: ProfessionalCompleteRegisterFormData) => {
    if (!acceptedPrivacyPolicy) {
      setPrivacyPolicyError('Você precisa aceitar a política de privacidade')
      return
    }
    setPrivacyPolicyError('')
    props.handleSubmit(data)
  }

  return (
    <form
      className="flex flex-col gap-10 w-full"
      onSubmit={handleSubmit(onSubmit)}
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
      <SocialMediaContainerInput
        socialMediaFields={socialMediaFields}
        removeSocialMedia={removeSocialMedia}
        register={register}
        errors={errors}
        appendNewSocialMedia={appendNewSocialMedia}
      />
      <PrivacyPolicyCheckbox
        checked={acceptedPrivacyPolicy}
        onChange={setAcceptedPrivacyPolicy}
        error={privacyPolicyError}
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

export default ProfessionalInputContainer
