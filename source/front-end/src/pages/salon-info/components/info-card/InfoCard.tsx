import React, { HTMLInputTypeAttribute } from 'react'
import { PlusCircleIcon } from '@heroicons/react/24/outline'
import InfoCardInput from './InfoCardInput'
import { SalonInfoUpdateFormData } from '../../types'
import { UseFormRegister } from 'react-hook-form'
import { SalonInfo } from '../../../../store/salon-info/types'

interface InfoCardProps {
  name: string
  icon: React.ReactNode
  inputInfos: {
    label: string
    inputType: HTMLInputTypeAttribute | 'select'
    fieldName: keyof SalonInfoUpdateFormData
    error?: string | undefined
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
    selectOptions?: { label: string; value: string }[]
  }[]
  showAddNewButton?: boolean
  register: UseFormRegister<SalonInfoUpdateFormData>
  salonData?: SalonInfo | undefined
}

function InfoCard({
  name,
  icon,
  showAddNewButton = true,
  inputInfos,
  register,
  salonData,
}: InfoCardProps) {
  return (
    <div className="flex flex-col gap-6 p-4 mb-2 bg-[#222222] text-primary-0 rounded-lg shadow-md">
      <div className="flex gap-2 items-center">
        {icon}
        <h2 className="text-base text-primary-0">{name}</h2>
      </div>
      <div className="flex flex-col gap-8">
        {inputInfos.map((inputInfo, index) => {
          return (
            <InfoCardInput
              key={index}
              id={index + '-input'}
              inputType={inputInfo.inputType}
              label={inputInfo.label}
              fieldName={inputInfo.fieldName}
              register={register}
              index={index}
              errors={inputInfo.error}
              onChange={inputInfo.onChange}
              salonData={salonData}
              selectOptions={inputInfo.selectOptions}
            />
          )
        })}
      </div>
      {showAddNewButton && (
        <PlusCircleIcon className="size-8 stroke-[#979797] self-center" />
      )}
    </div>
  )
}

export default InfoCard
