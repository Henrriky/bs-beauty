import React from 'react'
import { PlusCircleIcon } from '@heroicons/react/24/outline'
import { ZodSchema } from 'zod'
import InfoCardInput from './InfoCardInput'

interface InfoCardProps {
  name: string
  icon: React.ReactNode
  inputInfos: {
    label: string
    inputType: string
  }[]
  schema?: ZodSchema<unknown>
  showAddNewButton?: boolean
}

function InfoCard({
  name,
  icon,
  showAddNewButton = true,
  inputInfos,
}: InfoCardProps) {
  return (
    <div className="flex flex-col gap-6 p-4 mb-2 bg-[#222222] text-primary-0 rounded-lg shadow-md">
      <div className="flex gap-2 items-center">
        {icon}
        <p className="text-base text-primary-0">{name}</p>
      </div>
      <div className="flex flex-col gap-6">
        {inputInfos.map((inputInfo, index) => {
          return (
            <InfoCardInput
              key={index}
              id={index + '-input'}
              inputType={inputInfo.inputType}
              label={inputInfo.label}
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
