import { ReactNode } from 'react'

interface CustomerCardDescriptionProps {
  children: ReactNode
}

function CustomerCardDescription(props: CustomerCardDescriptionProps) {
  return (
    <h2 className="text-[#696969] text-xs font-medium">{props.children}</h2>
  )
}

export default CustomerCardDescription
