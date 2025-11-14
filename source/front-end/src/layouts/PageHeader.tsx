import Subtitle from '../components/texts/Subtitle'
import Title from '../components/texts/Title'
import { SectionDivider } from './SectionDivider'
import { ReactNode } from 'react'

type PageHeaderProps = {
  title: string
  subtitle?: ReactNode
  showDivider?: boolean
  dividerWidthClass?: string
  className?: string
}

export function PageHeader({
  title,
  subtitle,
  showDivider = true,
  dividerWidthClass = 'w-1/2',
  className = 'mt-3 mb-6',
}: PageHeaderProps) {
  return (
    <header className={`flex flex-col ${className}`}>
      <Title align="left">{title}</Title>

      {subtitle && (
        <div className="flex flex-col mt-3">
          <Subtitle align="left">{subtitle}</Subtitle>
        </div>
      )}

      {showDivider && <SectionDivider widthClass={dividerWidthClass} />}
    </header>
  )
}
