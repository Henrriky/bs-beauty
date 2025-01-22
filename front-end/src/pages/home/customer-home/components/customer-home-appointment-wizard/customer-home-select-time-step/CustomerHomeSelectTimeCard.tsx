import { DateTime } from 'luxon'
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
      className={`
        flex items-center justify-between w-fit h-10 px-4 rounded-md transition-colors duration-300 ease-in-out
        ${
          props.isBusy
            ? 'bg-[#2D2D2D] border-none hover:cursor-default'
            : `hover:cursor-pointer hover:bg-[#534138] border-[2px] border-[#A4978A] ${props.isSelected ? 'bg-[#3A3027]' : 'bg-transparent'} `
        } `}
      htmlFor={props.for}
      onClick={props.isBusy ? () => {} : props.onClick}
    >
      <CustomerHomeSelectTimeCardContent isBusy={props.isBusy}>
        {DateTime.fromMillis(props.startDate)
          .setZone('local')
          .toFormat('HH:mm')}
      </CustomerHomeSelectTimeCardContent>
    </label>
  )
}

export default CustomerHomeSelectTimeCard
