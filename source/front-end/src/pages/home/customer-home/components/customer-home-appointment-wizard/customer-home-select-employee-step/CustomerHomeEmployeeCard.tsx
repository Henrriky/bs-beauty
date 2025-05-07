import { EmployeesOfferingServiceOffer } from '../../../../../../store/service/types'
import CustomerHomeEmployeeCardPersonalInfo from './CustomerHomeEmployeeCardPersonalInfo'
import CustomerHomeEmployeeCardOfferInfo from './CustomerHomeEmployeeCardOfferInfo'

interface CustomerHomeEmployeeCardProps extends EmployeesOfferingServiceOffer {
  key: string
  for: string
  isSelected: boolean
  onClick?: React.MouseEventHandler<HTMLLabelElement> | undefined
}

function CustomerHomeEmployeeCard(props: CustomerHomeEmployeeCardProps) {
  return (
    <label
      className={`flex items-center justify-between h-20 py-2 px-6 rounded-2xl mt-5 bg-[#262626] hover:cursor-pointer 
                  transition-all duration-300 ease-in-out
                  ${props.isSelected ? 'border-[1px] border-[#A4978A]' : 'border-[0px] border-transparent'}`}
      htmlFor={props.for}
      onClick={props.onClick}
    >
      <CustomerHomeEmployeeCardPersonalInfo
        employeeName={props.employee.name || 'Não definido'}
        employeeSpecialization={props.employee.specialization || 'Nenhuma'}
        employeePhotoUrl={
          props.employee.profilePhotoUrl ||
          'https://cdn-site-assets.veed.io/cdn-cgi/image/width=256,quality=75,format=auto/Fish_6e8d209905/Fish_6e8d209905.webp'
        }
      />
      <CustomerHomeEmployeeCardOfferInfo
        offerEstimatedTime={props.estimatedTime || 'Não definido'}
        offerPrice={props.price}
      />
    </label>
  )
}

export default CustomerHomeEmployeeCard
