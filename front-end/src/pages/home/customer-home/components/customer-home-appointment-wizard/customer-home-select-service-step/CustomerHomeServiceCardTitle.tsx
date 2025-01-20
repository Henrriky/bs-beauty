import { ReactNode } from 'react'

interface CustomerHomeServiceCardTitleProps {
  children: ReactNode
}

function CustomerHomeServiceCardTitle(
  props: CustomerHomeServiceCardTitleProps,
) {
  return (
    <h1 className="text-[#D9D9D9] text-base text-opacity-85">
      {props.children}
    </h1>
  )
}

export default CustomerHomeServiceCardTitle
