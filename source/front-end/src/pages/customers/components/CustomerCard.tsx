import { Customer } from '../../../store/auth/types'
import { firstLetterOfWordToUpperCase } from '../../../utils/formatter/first-letter-of-word-to-upper-case.util'
import ProfilePicture from '../../profile/components/ProfilePicture'
import CustomerCardDescription from './CustomerCardDescription'
import CustomerCardTitle from './CustomerCardTitle'

interface CustomerCardProps {
  customer: Customer
}

function CustomerCard({ customer }: CustomerCardProps) {
  return (
    <div className="flex items-center gap-4 py-4 px-6 rounded-2xl mt-5 bg-[#262626] border-[1px] border-[#D9D9D9] border-opacity-25">
      <ProfilePicture
        size="sm"
        profilePhotoUrl={
          customer.profilePhotoUrl
            ? customer.profilePhotoUrl
            : 'https://cdn-site-assets.veed.io/cdn-cgi/image/width=256,quality=75,format=auto/Fish_6e8d209905/Fish_6e8d209905.webp'
        }
      />
      <div>
        <CustomerCardTitle>
          {firstLetterOfWordToUpperCase(customer.name ?? 'Nome não disponível')}
        </CustomerCardTitle>
        <CustomerCardDescription>{customer.email}</CustomerCardDescription>
      </div>
    </div>
  )
}

export default CustomerCard
