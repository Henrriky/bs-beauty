import { ReactNode } from 'react'
import GoBackButton from '../button/GoBackButton/GoBackButton'

interface props {
  children: ReactNode
}

export function GoBackButtonLayout({ children }: props) {
  return (
    <div>
      <GoBackButton />
      <hr className="border-[#424242] mb-10" />
      <div>{children}</div>
    </div>
  )
}
