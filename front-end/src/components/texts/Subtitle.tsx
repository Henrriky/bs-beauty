import { ReactNode } from 'react'

interface SubtitleProps {
  children: ReactNode
  align: 'center' | 'left' | 'right'
  color?: 'primary-golden' | 'secondary-white'
}

function Subtitle({
  children,
  align = 'center',
  color = 'secondary-white',
}: SubtitleProps) {
  const alignment =
    align === 'center'
      ? 'text-center'
      : align === 'left'
        ? 'text-left'
        : align === 'right'
          ? 'text-right'
          : ''

  const textColor =
    color === 'primary-golden'
      ? 'text-[#A4978A]'
      : color === 'secondary-white'
        ? 'text-[#979797]'
        : 'text-[#979797]'

  return (
    <h1 className={`text-sm ${textColor} ${alignment} font-medium`}>
      {children}
    </h1>
  )
}

export default Subtitle
