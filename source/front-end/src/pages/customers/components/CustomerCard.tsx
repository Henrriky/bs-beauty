import { Customer } from '../../../store/auth/types'
import { firstLetterOfWordToUpperCase } from '../../../utils/formatter/first-letter-of-word-to-upper-case.util'
import ProfilePicture from '../../profile/components/ProfilePicture'
import CustomerCardDescription from './CustomerCardDescription'
import CustomerCardTitle from './CustomerCardTitle'
import { Formatter } from '../../../utils/formatter/formatter.util'

interface CustomerCardProps {
  customer: Customer
}

function CustomerCard({ customer }: CustomerCardProps) {
  return (
    <div className="w-full bg-[#222222] rounded-2xl border-none px-4 py-3 flex items-center gap-3">
      <div className='mr-3'>
        <ProfilePicture
          size="sm"
          profilePhotoUrl={customer.profilePhotoUrl ?? ''}
          displayName={customer.name ?? 'Cliente'}
        />
      </div>

      <div className="flex flex-col gap-1 min-w-0">
        <CustomerCardTitle>
          {firstLetterOfWordToUpperCase(customer.name ?? 'Nome não disponível')}
        </CustomerCardTitle>
        <CustomerCardDescription>{customer.email}</CustomerCardDescription>
        {customer.phone && (
          <CustomerCardDescription>
            {Formatter.formatPhoneNumber(customer.phone)}
          </CustomerCardDescription>
        )}
      </div>
    </div>
  )
}

export default CustomerCard
