import { ReactNode } from 'react'
import clsx from 'clsx'

interface SubtitleProps {
  children: ReactNode
  align: 'center' | 'left' | 'right'
  color?: 'primary-golden' | 'secondary-white'
  className?: string
}

function Subtitle({
  children,
  align = 'center',
  color = 'secondary-white',
  className,
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
    <h1
      className={clsx(
        `text-sm ${textColor} ${alignment} font-medium`,
        className,
      )}
    >
      {children}
    </h1>
  )
}

export default Subtitle
