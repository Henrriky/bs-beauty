import { UseFormRegister } from 'react-hook-form'
import { Input } from '../../../components/inputs/Input'
import { SalonInfoUpdateFormData } from '../types'
import OpeningHoursInput from './inputs/OpeningHoursInput'
import { HTMLInputTypeAttribute } from 'react'
import { SalonInfo } from '../../../store/salon-info/types'

interface InfoCardInputProps {
  id: string
  inputType: HTMLInputTypeAttribute
  label: string
  fieldName: keyof SalonInfoUpdateFormData
  index: number
  register: UseFormRegister<SalonInfoUpdateFormData>
  errors: string | undefined
  onChange?: (e: any) => void
  salonData: SalonInfo | undefined
}

function InfoCardInput({
  id,
  inputType,
  label,
  fieldName,
  index,
  register,
  errors,
  onChange,
  salonData,
}: InfoCardInputProps) {
  return inputType === 'time' ? (
    <OpeningHoursInput
      label={label}
      inputType={inputType}
      index={index}
      register={register}
      salonData={salonData}
    />
  ) : (
    <div className="relative">
      <Input
        id={id}
        type={inputType}
        label={label}
        registration={{ ...register(fieldName) }}
        error={errors}
        onChange={onChange}
      />
    </div>
  )
}

export default InfoCardInput
