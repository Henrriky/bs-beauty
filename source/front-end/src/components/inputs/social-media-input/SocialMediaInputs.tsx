import {
  FieldArrayWithId,
  FieldErrors,
  UseFieldArrayRemove,
  UseFormRegister,
} from 'react-hook-form'
import { Input } from '../Input'
import { Button } from '../../button/Button'
import { TrashIcon } from '@heroicons/react/24/outline'
import { getErrorMessageFromErrorsAttr } from '../../../utils/react-hook-form/get-error-message-from-errors-attr'
import { EmployeeUpdateProfileFormData } from '../../../pages/profile/types'

interface SocialMediaInputsProps {
  register: UseFormRegister<EmployeeUpdateProfileFormData>
  socialMediaFields: FieldArrayWithId<
    EmployeeUpdateProfileFormData,
    'socialMedia',
    'id'
  >[]
  removeSocialMedia: UseFieldArrayRemove
  errors: FieldErrors<EmployeeUpdateProfileFormData>
}

function SocialMediaInputs({
  socialMediaFields,
  register,
  removeSocialMedia,
  errors,
}: SocialMediaInputsProps) {
  return (
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
              className="max-w-10 border-none hover:text-[#B19B86] rounded-none hover:bg-opacity-0 hover:bg-transparent"
            />
          </div>
        )
      })}
    </div>
  )
}

export default SocialMediaInputs
