import ProfilePicture from '../../../../../profile/components/ProfilePicture'
import { firstLetterOfWordToUpperCase } from '../../../../../../utils/formatter/first-letter-of-word-to-upper-case.util'
import CustomerHomeProfessionalCardTitle from './CustomerHomeProfessionalCardTitle'
import CustomerHomeProfessionalCardDescription from './CustomerHomeProfessionalCardDescription'
import { useFormContext } from 'react-hook-form'
import { CreateAppointmentFormData } from '../types'
import { useEffect } from 'react'

interface CustomerHomeProfessionalCardPersonalInfoProps {
  professionalName: string
  professionalSpecialization: string
  professionalPhotoUrl: string
}

function CustomerHomeProfessionalCardPersonalInfo(
  props: CustomerHomeProfessionalCardPersonalInfoProps,
) {
  const { setValue } = useFormContext<CreateAppointmentFormData>()

  useEffect(() => {
    if (props.professionalPhotoUrl) {
      setValue('professionalPhotoUrl', props.professionalPhotoUrl)
    }
  }, [props.professionalPhotoUrl, setValue])
  return (
    <div className="flex items-center gap-4">
      <div className="">
        <ProfilePicture
          size="md"
          variation="square-with-bg"
          profilePhotoUrl={props.professionalPhotoUrl}
        />
      </div>
      <div className="flex flex-col">
        <CustomerHomeProfessionalCardTitle>
          {firstLetterOfWordToUpperCase(props.professionalName)}
        </CustomerHomeProfessionalCardTitle>
        <CustomerHomeProfessionalCardDescription>
          {props.professionalSpecialization}
        </CustomerHomeProfessionalCardDescription>
      </div>
    </div>
  )
}

export default CustomerHomeProfessionalCardPersonalInfo
