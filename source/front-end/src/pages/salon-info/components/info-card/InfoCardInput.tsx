import { UseFormRegister } from 'react-hook-form'
import { Input } from '../../../../components/inputs/Input'
import { Select } from '../../../../components/inputs/Select'
import { SalonInfoUpdateFormData } from '../../types'
import OpeningHoursInput from '../inputs/OpeningHoursInput'
import { HTMLInputTypeAttribute } from 'react'
import { SalonInfo } from '../../../../store/salon-info/types'

interface InfoCardInputProps {
  id: string
  inputType: HTMLInputTypeAttribute | 'select'
  label: string
  fieldName: keyof SalonInfoUpdateFormData
  index: number
  register: UseFormRegister<SalonInfoUpdateFormData>
  errors: string | undefined
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  salonData?: SalonInfo | undefined
  selectOptions?: { label: string; value: string }[]
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
  selectOptions,
}: InfoCardInputProps) {
  if (inputType === 'time') {
    return (
      <OpeningHoursInput
        label={label}
        inputType={inputType}
        index={index}
        register={register}
        salonData={salonData}
      />
    )
  }

  if (inputType === 'select') {
    return (
      <div className="relative">
        <Select
          id={id}
          label={label}
          options={selectOptions || []}
          registration={{ ...register(fieldName) }}
          error={errors}
          placeholder="Selecione o tempo de antecedência"
        />
      </div>
    )
  }

  return (
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
