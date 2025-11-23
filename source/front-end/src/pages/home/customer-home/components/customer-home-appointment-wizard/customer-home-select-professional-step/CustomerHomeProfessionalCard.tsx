import { ProfessionalsOfferingServiceOffer } from '../../../../../../store/service/types'
import CustomerHomeProfessionalCardPersonalInfo from './CustomerHomeProfessionalCardPersonalInfo'
import CustomerHomeOfferInfo from '../CustomerHomeOfferInfo'
import CustomerHomeStepArrowButton from '../CustomerHomeStepArrowButton'
import CustomerHomeStepBackButton from '../CustomerHomeStepBackButton'

interface CustomerHomeProfessionalCardProps
  extends Omit<ProfessionalsOfferingServiceOffer, 'paymentMethods'> {
  key: string
  for: string
  isSelected: boolean
  onClick?: React.MouseEventHandler<HTMLLabelElement> | undefined
  currentFlow: 'service' | 'professional'
  onArrowClick?: () => void
  onBackClick?: () => void
}

function CustomerHomeProfessionalCard(
  props: CustomerHomeProfessionalCardProps,
) {
  const showArrow = props.isSelected
  const showBackButton = showArrow && props.onBackClick !== undefined

  return (
    <label
      className={`
        relative
        flex items-center justify-between h-20 py-2 px-6 mt-5 rounded-2xl bg-[#262626] hover:cursor-pointer 
        transition-all duration-300 ease-in-out
        ${props.isSelected ? 'border-[1px] border-[#A4978A]' : 'border-[0px] border-transparent'}
      `}
      htmlFor={props.for}
      onClick={props.onClick}
    >
      <CustomerHomeProfessionalCardPersonalInfo
        professionalName={props.professional.name || 'Não definido'}
        professionalSpecialization={
          props.professional.specialization || 'Nenhuma'
        }
        professionalPhotoUrl={props.professional.profilePhotoUrl ?? ''}
      />

      <div className='ml-2 mr-5'>
        {props.currentFlow === 'service' && (
          <CustomerHomeOfferInfo
            offerEstimatedTime={props.estimatedTime || 'Não definido'}
            offerPrice={props.price || 'N/A'}
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

export default CustomerHomeProfessionalCard
