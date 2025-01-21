import { Formatter } from '../../../../../../utils/formatter/formatter.util'
import CustomerHomeSelectTimeCardContent from './CustomerHomeSelectTimeContent'

interface CustomerHomeSelectTimeCardProps {
  for: string
  startDate: number
  isBusy: boolean
  isSelected: boolean
  onClick?: React.MouseEventHandler<HTMLLabelElement> | undefined
}

function CustomerHomeSelectTimeCard(props: CustomerHomeSelectTimeCardProps) {
  return (
    <label
      className={`flex items-center justify-between w-fit h-10 px-4 rounded-md bg-transparent hover:cursor-pointer 
                  transition-all duration-300 ease-in-out hover:bg-[#2c231e] border-[2px] border-[#A4978A]
                  ${props.isSelected ? 'bg-[#3A3027]' : ''} ${props.isBusy ? 'bg-[#2D2D2D] border-none hover:cursor-default hover:bg-[#2D2D2D]' : ''}`}
      htmlFor={props.for}
      onClick={props.isBusy ? () => {} : props.onClick}
    >
      <CustomerHomeSelectTimeCardContent isBusy={props.isBusy}>
        {Formatter.formatTimeOfDay(new Date(props.startDate).getUTCHours())}
      </CustomerHomeSelectTimeCardContent>
    </label>
  )
}

export default CustomerHomeSelectTimeCard
