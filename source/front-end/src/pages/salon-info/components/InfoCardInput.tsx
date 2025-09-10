import { PencilSquareIcon } from '@heroicons/react/24/outline'
import { Input } from '../../../components/inputs/Input'

interface InfoCardInputProps {
  id: string
  inputType: string
  label: string
}

function InfoCardInput({ id, inputType, label }: InfoCardInputProps) {
  return inputType === 'time' ? (
    <div className="relative">
      <p className="text-sm mb-1">{label}</p>
      <div className="flex justify-between w-1/3">
        <p className="text-sm">Das</p>
        <Input id={id} type={inputType} inputClassName="text-primary-0" />
        <p className="text-sm">até</p>
        <Input id={id} type={inputType} inputClassName="text-primary-0" />
      </div>
      <PencilSquareIcon className="size-5 stroke-[#A5A5A5] absolute inset-y-[20px] right-2 hover:stroke-[#D9D9D9] transition-all" />
    </div>
  ) : (
    <div className="relative">
      <Input id={id} type={inputType} label={label} />
      <PencilSquareIcon className="size-5 stroke-[#A5A5A5] absolute inset-y-[15px] right-2 hover:stroke-[#D9D9D9] transition-all" />
    </div>
  )
}

export default InfoCardInput
