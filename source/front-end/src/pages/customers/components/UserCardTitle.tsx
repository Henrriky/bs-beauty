import { ReactNode } from 'react'

interface UserCardTitleProps {
  children: ReactNode
}

function UserCardTitle(props: UserCardTitleProps) {
  return <h1 className="text-[#D9D9D9] text-xs">{props.children}</h1>
}

export default UserCardTitle
