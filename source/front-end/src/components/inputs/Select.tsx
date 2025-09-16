// components/inputs/Select.tsx
import { SelectHTMLAttributes, ReactNode } from 'react'
import { UseFormRegisterReturn } from 'react-hook-form'
import clsx from 'clsx'
import { ErrorMessage } from '../feedback/ErrorMessage'

type Option = { label: string; value: string }

export interface SelectProps
  extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'id'> {
  label?: string | ReactNode
  id: string
  options: Option[]
  error?: string | null
  registration?: UseFormRegisterReturn
  variant?: 'solid' | 'outline'
  wrapperClassName?: string | undefined
  inputClassName?: string | undefined
  placeholder?: string
}

export function Select({
  label,
  id,
  options,
  error,
  registration,
  wrapperClassName,
  inputClassName,
  variant = 'outline',
  placeholder = 'Selecione uma opção',
  ...htmlProps
}: SelectProps) {
  const borderColor = error
    ? 'border-[#CC3636]'
    : variant === 'outline'
      ? 'border-[#3B3B3B]'
      : 'border-white'

  return (
    <div className={clsx('flex gap-3 flex-col items-start', wrapperClassName)}>
      {label && (
        <label className="text-sm text-[#D9D9D9]" htmlFor={id}>
          {label}
        </label>
      )}

      <select
        id={id}
        {...registration}
        {...htmlProps}
        defaultValue=""
        className={clsx(
          variant === 'outline'
            ? `text-sm text-[#A5A5A5] bg-transparent focus:outline-none w-full
               border-solid border-b-2 ${borderColor} pb-2
               focus-within:border-[#B19B86] transition-colors duration-300`
            : `w-full text-sm text-[#A5A5A5] bg-[#1a1a1a] focus:outline-none
               ${borderColor} border-[1px] border-opacity-10 rounded-2xl px-2 py-[10px]
               focus-within:border-[#B19B86] transition-colors duration-300 disabled:bg-[#272727]`,
          // aparência coerente do arrow em todos os browsers
          'appearance-none bg-right bg-no-repeat pr-8',
          inputClassName,
        )}
        // pequena seta usando SVG embutido (combina com outline/solid)
        style={{
          backgroundImage:
            'url("data:image/svg+xml,%3Csvg width=\'16\' height=\'16\' viewBox=\'0 0 24 24\' fill=\'none\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M6 9l6 6 6-6\' stroke=\'%23A5A5A5\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'/%3E%3C/svg%3E")',
          backgroundPosition: 'right 0.25rem center',
        }}
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} className="bg-[#1a1a1a]">
            {opt.label}
          </option>
        ))}
      </select>

      {error && <ErrorMessage message={error} />}
    </div>
  )
}
