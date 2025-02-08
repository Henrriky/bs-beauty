import { ReactNode } from 'react'

interface UserCardDescriptionProps {
  children: ReactNode
}

function UserCardDescription(props: UserCardDescriptionProps) {
  return (
    <h2 className="text-[#696969] text-xs font-medium">{props.children}</h2>
  )
}

export default UserCardDescription
