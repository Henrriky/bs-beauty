import { BriefcaseIcon } from '@heroicons/react/24/outline'
import { Service } from '../../../../../../store/service/types'
import CustomerHomeServiceCardTitle from './CustomerHomeServiceCardTitle'
import CustomerHomeServiceCardDescription from './CustomerHomeServiceCardDescription'

interface CustomerHomeServiceCardProps
  extends Pick<Service, 'name' | 'id' | 'description'> {
  key: string
  for: string
  isSelected: boolean
}

function CustomerHomeServiceCard(props: CustomerHomeServiceCardProps) {
  return (
    <label
      className={`flex items-center gap-8 h-20 py-2 px-6 rounded-2xl mt-5 bg-[#262626] hover:cursor-pointer 
                  transition-all duration-300 ease-in-out
                  ${props.isSelected ? 'border-[1px] border-[#A4978A]' : 'border-[0px] border-transparent'}`}
      htmlFor={props.for}
    >
      <div className="">
        <BriefcaseIcon color={'#434544'} className="size-8" />
      </div>
      <div className="w-[1.5px] h-full bg-[#595149] rounded-sm"></div>
      <div className="flex flex-col">
        <CustomerHomeServiceCardTitle>
          {props.name}
        </CustomerHomeServiceCardTitle>
        <CustomerHomeServiceCardDescription>
          {props.description}
        </CustomerHomeServiceCardDescription>
      </div>
    </label>
  )
}

export default CustomerHomeServiceCard
