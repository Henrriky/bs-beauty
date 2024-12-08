import { PlusIcon } from '@heroicons/react/24/outline'
import { Button } from '../../button/Button'
import { UseFieldArrayAppend } from 'react-hook-form'
import { EmployeeUpdateProfileFormData } from '../../../pages/profile/types'

interface SocialMediaHeaderProps {
  socialMediaFieldsLength: number
  appendNewSocialMedia: UseFieldArrayAppend<
    EmployeeUpdateProfileFormData,
    'socialMedia'
  >
}

function SocialMediaHeader({
  socialMediaFieldsLength,
  appendNewSocialMedia,
}: SocialMediaHeaderProps) {
  return (
    <>
      <label className="text-sm text-[#D9D9D9]" htmlFor="socialMedia">
        Redes sociais
      </label>
      <Button
        type="button"
        variant="outline"
        disabled={socialMediaFieldsLength >= 5}
        outlineVariantBorderStyle="dashed"
        onClick={() => appendNewSocialMedia({ name: '', url: '' })}
        label={
          <div className="flex justify-center items-center gap-1">
            <PlusIcon className="size-5" />
            <p className="text-sm">
              {socialMediaFieldsLength >= 5
                ? 'Limite atingido'
                : 'Clique para uma nova'}
            </p>
          </div>
        }
      />
    </>
  )
}

export default SocialMediaHeader
