import { ReactNode } from 'react'

interface CustomerCardDescriptionProps {
  children: ReactNode
}

function CustomerCardDescription(props: CustomerCardDescriptionProps) {
  return (
    <h2 className="text-[#979797] text-sm font-medium">{props.children}</h2>
  )
}

export default CustomerCardDescription
