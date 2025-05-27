import {
  FieldArrayWithId,
  FieldErrors,
  UseFieldArrayAppend,
  UseFieldArrayRemove,
  UseFormRegister,
} from 'react-hook-form'
import SocialMediaInputs from './SocialMediaInputs'
import SocialMediaHeader from './SocialMediaHeader'
import { EmployeeUpdateProfileFormData } from '../../../pages/profile/types'

interface SocialMediaContainerInputProps {
  register: UseFormRegister<EmployeeUpdateProfileFormData>
  socialMediaFields: FieldArrayWithId<
    EmployeeUpdateProfileFormData,
    'socialMedia',
    'id'
  >[]
  appendNewSocialMedia: UseFieldArrayAppend<
    EmployeeUpdateProfileFormData,
    'socialMedia'
  >
  removeSocialMedia: UseFieldArrayRemove
  errors: FieldErrors<EmployeeUpdateProfileFormData>
}

function SocialMediaContainerInput({
  socialMediaFields,
  appendNewSocialMedia,
  removeSocialMedia,
  register,
  errors,
}: SocialMediaContainerInputProps) {
  return (
    <div className="flex gap-3 flex-col items-start">
      <SocialMediaHeader
        socialMediaFieldsLength={socialMediaFields.length}
        appendNewSocialMedia={appendNewSocialMedia}
      />
      <SocialMediaInputs
        socialMediaFields={socialMediaFields}
        removeSocialMedia={removeSocialMedia}
        register={register}
        errors={errors}
      />
    </div>
  )
}

export default SocialMediaContainerInput
