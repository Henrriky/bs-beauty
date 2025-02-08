import { ReactNode } from 'react'
import GoBackButton from '../button/GoBackButton'

interface props {
  children: ReactNode
  label?: string
}

export function GoBackButtonLayout({ children, label }: props) {
  return (
    <div>
      <GoBackButton label={label} />
      <hr className="border-[#424242] mb-10" />
      <div>{children}</div>
    </div>
  )
}
