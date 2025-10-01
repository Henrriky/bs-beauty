import { ProfessionalsOfferingServiceOffer } from '../../../../../../store/service/types'
import CustomerHomeProfessionalCardPersonalInfo from './CustomerHomeProfessionalCardPersonalInfo'
import CustomerHomeOfferInfo from '../CustomerHomeOfferInfo'

interface CustomerHomeProfessionalCardProps
  extends Omit<ProfessionalsOfferingServiceOffer, 'paymentMethods'> {
  key: string
  for: string
  isSelected: boolean
  onClick?: React.MouseEventHandler<HTMLLabelElement> | undefined
  currentFlow: 'service' | 'professional'
}

function CustomerHomeProfessionalCard(
  props: CustomerHomeProfessionalCardProps,
) {
  return (
    <label
      className={`flex items-center justify-between h-20 py-2 px-6 rounded-2xl mt-5 bg-[#262626] hover:cursor-pointer 
                  transition-all duration-300 ease-in-out
                  ${props.isSelected ? 'border-[1px] border-[#A4978A]' : 'border-[0px] border-transparent'}`}
      htmlFor={props.for}
      onClick={props.onClick}
    >
      <CustomerHomeProfessionalCardPersonalInfo
        professionalName={props.professional.name || 'Não definido'}
        professionalSpecialization={
          props.professional.specialization || 'Nenhuma'
        }
        professionalPhotoUrl={
          props.professional.profilePhotoUrl ||
          'https://cdn-site-assets.veed.io/cdn-cgi/image/width=256,quality=75,format=auto/Fish_6e8d209905/Fish_6e8d209905.webp'
        }
      />
      {props.currentFlow === 'service' && (
        <CustomerHomeOfferInfo
          offerEstimatedTime={props.estimatedTime || 'Não definido'}
          offerPrice={props.price || 'N/A'}
        />
      )}
    </label>
  )
}

export default CustomerHomeProfessionalCard
