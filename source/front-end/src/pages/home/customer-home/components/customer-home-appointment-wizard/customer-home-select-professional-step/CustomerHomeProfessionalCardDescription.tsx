import { ReactNode } from 'react'

interface CustomerHomeServiceCardDescriptionProps {
  children: ReactNode
}

function CustomerHomeServiceCardDescription(
  props: CustomerHomeServiceCardDescriptionProps,
) {
  return (
    <h3 className="text-[#D9D9D9] text-xs text-opacity-55">{props.children}</h3>
  )
}

export default CustomerHomeServiceCardDescription
