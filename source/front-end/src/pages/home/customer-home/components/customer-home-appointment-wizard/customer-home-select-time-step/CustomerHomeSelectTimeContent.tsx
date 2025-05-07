import { ReactNode } from 'react'

interface CustomerHomeSelectTimeCardContentProps {
  children: ReactNode
  isBusy: boolean
}

function CustomerHomeSelectTimeCardContent(
  props: CustomerHomeSelectTimeCardContentProps,
) {
  return (
    <h3
      className={`${props.isBusy ? 'text-[#717171]' : 'text-[#A4978A]'} text-base font-medium`}
    >
      {props.children}
    </h3>
  )
}

export default CustomerHomeSelectTimeCardContent
