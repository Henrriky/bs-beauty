import { UseFormRegister } from 'react-hook-form'
import { Input } from '../../../components/inputs/Input'
import { SalonInfoUpdateFormData } from '../types'
import OpeningHoursInput from './inputs/OpeningHoursInput'
import { HTMLInputTypeAttribute } from 'react'

interface InfoCardInputProps {
  id: string
  inputType: HTMLInputTypeAttribute
  label: string
  fieldName: keyof SalonInfoUpdateFormData
  index: number
  register: UseFormRegister<SalonInfoUpdateFormData>
  errors: string | undefined
  onChange?: (e: any) => void
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
}: InfoCardInputProps) {
  return inputType === 'time' ? (
    <OpeningHoursInput
      label={label}
      inputType={inputType}
      index={index}
      register={register}
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
