import { ReactNode } from 'react'

interface CustomerHomeServiceCardDescriptionProps {
  children: ReactNode
}

function CustomerHomeServiceCardDescription(
  props: CustomerHomeServiceCardDescriptionProps,
) {
  return (
    <h1 className="text-[#D9D9D9] text-xs text-opacity-55">{props.children}</h1>
  )
}

export default CustomerHomeServiceCardDescription
