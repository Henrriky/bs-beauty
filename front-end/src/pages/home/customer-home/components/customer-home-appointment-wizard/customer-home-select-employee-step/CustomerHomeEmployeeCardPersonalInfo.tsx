import ProfilePicture from '../../../../../profile/components/ProfilePicture'
import { firstLetterOfWordToUpperCase } from '../../../../../../utils/formatter/first-letter-of-word-to-upper-case.util'
import CustomerHomeEmployeeCardTitle from './CustomerHomeEmployeeCardTitle'
import CustomerHomeEmployeeCardDescription from './CustomerHomeEmployeeCardDescription'

interface CustomerHomeEmployeeCardPersonalInfoProps {
  employeeName: string
  employeeSpecialization: string
  employeePhotoUrl: string
}

function CustomerHomeEmployeeCardPersonalInfo(
  props: CustomerHomeEmployeeCardPersonalInfoProps,
) {
  return (
    <div className="flex items-center gap-4">
      <div className="">
        <ProfilePicture
          size="md"
          variation="square-with-bg"
          profilePhotoUrl={props.employeePhotoUrl}
        />
      </div>
      <div className="flex flex-col">
        <CustomerHomeEmployeeCardTitle>
          {firstLetterOfWordToUpperCase(props.employeeName)}
        </CustomerHomeEmployeeCardTitle>
        <CustomerHomeEmployeeCardDescription>
          {props.employeeSpecialization}
        </CustomerHomeEmployeeCardDescription>
      </div>
    </div>
  )
}

export default CustomerHomeEmployeeCardPersonalInfo
