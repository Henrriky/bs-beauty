import { ReactNode } from 'react'

interface SubtitleProps {
  children: ReactNode
  align: 'center' | 'left' | 'right'
}

function Subtitle({ children, align = 'center' }: SubtitleProps) {
  return (
    <h1 className={`text-sm text-[#979797] text-${align} font-medium`}>
      {children}
    </h1>
  )
}

export default Subtitle
