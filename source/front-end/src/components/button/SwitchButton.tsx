import { Button } from './Button'

export interface SwitchButtonOption<T extends string> {
  value: T
  label: string
}

export interface SwitchButtonProps<T extends string> {
  options: SwitchButtonOption<T>[]
  value: T
  onChange: (value: T) => void
  className?: string
}

export function SwitchButton<T extends string>({
  options,
  value,
  onChange,
  className = '',
}: SwitchButtonProps<T>) {
  const getButtonClassName = (index: number, optionValue: T) => {
    const isFirst = index === 0
    const isLast = index === options.length - 1
    const isSelected = value === optionValue

    let buttonClassName = ''

    if (isFirst && !isLast) {
      buttonClassName = 'rounded-r-none'
    } else if (isLast && !isFirst) {
      buttonClassName = 'rounded-l-none'
    } else if (!isFirst && !isLast) {
      buttonClassName = 'rounded-none'
    }

    if (isSelected) {
      buttonClassName +=
        ' bg-[#3A3027] hover:!bg-[#3A3027] hover:cursor-default'
    }

    return buttonClassName
  }

  return (
    <div className={`flex ${className}`}>
      {options.map((option, index) => (
        <Button
          key={option.value}
          label={option.label}
          variant="outline"
          outlineVariantBorderStyle="solid"
          className={getButtonClassName(index, option.value)}
          onClick={() => onChange(option.value)}
        />
      ))}
    </div>
  )
}
