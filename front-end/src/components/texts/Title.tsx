import { ReactNode } from 'react'

interface TitleProps {
  children: ReactNode
  align: 'center' | 'left' | 'right'
}

function Title({ children, align = 'center' }: TitleProps) {
  return (
    <h1 className={`text-2xl text-[#D9D9D9] text-${align} font-medium`}>
      {children}
    </h1>
  )
}

export default Title
