import { ReactNode } from 'react'

interface CustomerCardTitleProps {
  children: ReactNode
}

function CustomerCardTitle(props: CustomerCardTitleProps) {
  return <h1 className="text-[#D9D9D9] text-sm">{props.children}</h1>
}

export default CustomerCardTitle
