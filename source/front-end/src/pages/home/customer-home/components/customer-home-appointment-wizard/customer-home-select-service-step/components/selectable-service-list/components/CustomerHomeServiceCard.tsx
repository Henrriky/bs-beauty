import { BriefcaseIcon } from '@heroicons/react/24/outline'
import { ServicesOfferedByProfessionalOffer } from '../../../../../../../../../store/professional/types.ts'
import CustomerHomeOfferInfo from '../../../../CustomerHomeOfferInfo.tsx'

interface CustomerHomeServiceCardProps
  extends ServicesOfferedByProfessionalOffer {
  key: string
  for: string
  isSelected: boolean
  onClick?: React.MouseEventHandler<HTMLLabelElement> | undefined
  currentFlow: 'service' | 'professional'
}

function CustomerHomeServiceCard(props: CustomerHomeServiceCardProps) {
  return (
    <label
      className={`flex items-center gap-8 h-20 py-2 px-6 rounded-2xl mt-5 bg-[#262626] hover:cursor-pointer 
                  transition-all duration-300 ease-in-out
                  ${props.isSelected ? 'border-[1px] border-[#A4978A]' : 'border-[0px] border-transparent'}`}
      htmlFor={props.for}
      onClick={props.onClick}
    >
      <div className="">
        <BriefcaseIcon color={'#434544'} className="size-8" />
      </div>
      <div className="w-[1.5px] h-full bg-[#595149] rounded-sm"></div>
      <div className="flex flex-col">
        <h1 className="text-[#D9D9D9] text-base text-opacity-85">
          {props.service.name}
        </h1>
        <h1 className="text-[#D9D9D9] text-xs text-opacity-55">
          {props.service.category}
        </h1>
      </div>
      {props.currentFlow === 'professional' && (
        <CustomerHomeOfferInfo
          offerEstimatedTime={props.estimatedTime || 'Não definido'}
          offerPrice={props.price ?? 'Não definido'}
        />
      )}
    </label>
  )
}

export default CustomerHomeServiceCard
