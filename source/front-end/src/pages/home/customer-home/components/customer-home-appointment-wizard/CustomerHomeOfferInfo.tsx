import { BanknotesIcon, ClockIcon } from '@heroicons/react/24/outline'

interface CustomerHomeProfessionalCardOfferInfoProps {
  offerPrice: string
  offerEstimatedTime: number | string
}

function CustomerHomeProfessionalCardOfferInfo(
  props: CustomerHomeProfessionalCardOfferInfoProps,
) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-2">
        <BanknotesIcon className="size-5 text-[#A4978A]" />
        <h3 className="text-[#A4978A] text-sm text-opacity-85 font-semibold">
          {new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
          }).format(Number(props.offerPrice))}
        </h3>
      </div>
      <div className="flex items-center gap-2">
        <ClockIcon className="size-5 text-[#A4978A]" />
        <h3 className="text-[#A4978A] text-sm text-opacity-85 font-semibold">
          Aprox {props.offerEstimatedTime} Min
        </h3>
      </div>
    </div>
  )
}

export default CustomerHomeProfessionalCardOfferInfo
