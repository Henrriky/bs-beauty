import { BriefcaseIcon } from '@heroicons/react/24/outline'
import { ServicesOfferedByProfessionalOffer } from '../../../../../../../../../store/professional/types.ts'
import CustomerHomeOfferInfo from '../../../../CustomerHomeOfferInfo.tsx'
import CustomerHomeStepArrowButton from '../../../../CustomerHomeStepArrowButton.tsx'
import CustomerHomeStepBackButton from '../../../../CustomerHomeStepBackButton.tsx'

interface CustomerHomeServiceCardProps
  extends Omit<ServicesOfferedByProfessionalOffer, 'paymentMethods'> {
  key: string
  for: string
  isSelected: boolean
  onClick?: React.MouseEventHandler<HTMLLabelElement> | undefined
  currentFlow: 'service' | 'professional'
  onArrowClick?: () => void
  onBackClick?: () => void
}

function CustomerHomeServiceCard(props: CustomerHomeServiceCardProps) {
  const showArrow = props.isSelected
  const showBackButton = showArrow && props.onBackClick !== undefined

  return (
    <label
      className={`
        relative
        flex items-center justify-between h-20 py-2 px-6 rounded-2xl mt-5 bg-[#262626] hover:cursor-pointer 
        transition-all duration-300 ease-in-out
        ${props.isSelected ? 'border-[1px] border-[#A4978A]' : 'border-[0px] border-transparent'}
      `}
      htmlFor={props.for}
      onClick={props.onClick}
    >
      <div className="flex items-center gap-8 h-full pr-8">
        <div>
          <BriefcaseIcon color="#434544" className="size-8" />
        </div>
        <div className="w-[1.5px] self-stretch bg-[#595149] rounded-sm" />
        <div className="flex flex-col">
          <h3 className="text-[#D9D9D9] text-base text-opacity-85">
            {props.service.name}
          </h3>
          <h3 className="text-[#D9D9D9] text-xs text-opacity-55">
            {props.service.category}
          </h3>
        </div>
      </div>

      <div className='mr-6'>
        {props.currentFlow === 'professional' && (
          <CustomerHomeOfferInfo
            offerEstimatedTime={props.estimatedTime || 'Não definido'}
            offerPrice={props.price ?? 'Não definido'}
          />
        )}
      </div>

      <CustomerHomeStepBackButton
        show={showBackButton}
        onClick={props.onBackClick}
      />

      <CustomerHomeStepArrowButton
        show={showArrow}
        onClick={props.onArrowClick}
      />

    </label>
  )
}

export default CustomerHomeServiceCard
