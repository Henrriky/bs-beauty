import { HTMLInputTypeAttribute, useState } from 'react'
import { Input } from '../../../../components/inputs/Input'
import { SalonInfoUpdateFormData } from '../../types'
import { UseFormRegister } from 'react-hook-form'
import { SalonInfo } from '../../../../store/salon-info/types'

interface OpeningHoursInputProps {
  label: string
  inputType: HTMLInputTypeAttribute
  index: number
  register: UseFormRegister<SalonInfoUpdateFormData>
  salonData: SalonInfo | undefined
}

function OpeningHoursInput({
  label,
  inputType,
  index,
  register,
  salonData,
}: OpeningHoursInputProps) {
  const [isClosed, setIsClosed] = useState(
    salonData?.openingHours?.at(index)?.isClosed,
  )

  const openingHoursInitialHourField =
    `openingHours.${index}.initialHour` as `openingHours.${number}.initialHour`

  const openingHoursFinalHourField =
    `openingHours.${index}.finalHour` as `openingHours.${number}.finalHour`

  const openingHoursIsClosedField =
    `openingHours.${index}.isClosed` as `openingHours.${number}.isClosed`

  return (
    <div>
      <div>
        <p className={`text-sm mb-1 ${isClosed ? 'text-gray-500' : ''}`}>
          {label}
        </p>
        <input
          type="hidden"
          value={label}
          {...register(`openingHours.${index}.name`)}
        />
      </div>
      <div className="flex justify-between w-1/3">
        <p className={`text-sm ${isClosed ? 'text-gray-500' : ''}`}>Das</p>
        <Input
          id={openingHoursInitialHourField}
          type={inputType}
          inputClassName={`${isClosed ? 'text-gray-500' : 'text-primary-0'}`}
          disabled={isClosed}
          registration={{ ...register(openingHoursInitialHourField) }}
          defaultValue={'00:00'}
        />
        <p className={`text-sm ${isClosed ? 'text-gray-500' : ''}`}>até</p>
        <Input
          id={openingHoursFinalHourField}
          type={inputType}
          inputClassName={`${isClosed ? 'text-gray-500' : 'text-primary-0'}`}
          disabled={isClosed}
          registration={{ ...register(openingHoursFinalHourField) }}
          defaultValue={'00:00'}
        />
      </div>
      <div className="flex items-center gap-2 mt-2">
        <Input
          id={openingHoursIsClosedField}
          type="checkbox"
          inputClassName="appearance-none size-4 border-2 border-[#A4978A] checked:bg-[#A4978A] focus:outline-none cursor-pointer"
          wrapperClassName="size-3"
          onChange={(e) => setIsClosed(e.target.checked)}
          registration={{ ...register(openingHoursIsClosedField) }}
        />
        <label
          htmlFor={openingHoursIsClosedField}
          className="text-sm text-[#D9D9D9] cursor-pointer"
          onMouseDown={(e) => e.preventDefault()}
        >
          Fechado
        </label>
      </div>
    </div>
  )
}

export default OpeningHoursInput
