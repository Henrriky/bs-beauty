import { ReactNode } from 'react'

interface TitleProps {
  children: ReactNode
  align: 'center' | 'left' | 'right'
}

function Title({ children, align = 'center' }: TitleProps) {
  const alignment =
    align === 'center'
      ? 'text-center'
      : align === 'left'
        ? 'text-left'
        : align === 'right'
          ? 'text-right'
          : ''
  return (
    <h1 className={`text-2xl text-[#D9D9D9] ${alignment} font-medium`}>
      {children}
    </h1>
  )
}

export default Title
