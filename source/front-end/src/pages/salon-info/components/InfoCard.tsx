import React, { HTMLInputTypeAttribute } from 'react'
import { PlusCircleIcon } from '@heroicons/react/24/outline'
import InfoCardInput from './InfoCardInput'
import { SalonInfoUpdateFormData } from '../types'
import { UseFormRegister } from 'react-hook-form'

interface InfoCardProps {
  name: string
  icon: React.ReactNode
  inputInfos: {
    label: string
    inputType: HTMLInputTypeAttribute
    fieldName: keyof SalonInfoUpdateFormData
    error?: string | undefined
    onChange?: (e: any) => void
  }[]
  showAddNewButton?: boolean
  register: UseFormRegister<SalonInfoUpdateFormData>
}

function InfoCard({
  name,
  icon,
  showAddNewButton = true,
  inputInfos,
  register,
}: InfoCardProps) {
  return (
    <div className="flex flex-col gap-6 p-4 mb-2 bg-[#222222] text-primary-0 rounded-lg shadow-md">
      <div className="flex gap-2 items-center">
        {icon}
        <p className="text-base text-primary-0">{name}</p>
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
