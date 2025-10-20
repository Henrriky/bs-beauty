import { InputHTMLAttributes, ReactNode } from 'react'
import { UseFormRegisterReturn } from 'react-hook-form'
import { ErrorMessage } from '../feedback/ErrorMessage'
import clsx from 'clsx'

export interface TimePickerProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string | ReactNode
  id: string
  error?: string | null
  registration?: UseFormRegisterReturn
  variant?: 'solid' | 'outline'
  wrapperClassName?: string | undefined
  inputClassName?: string | undefined
}

export function TimePicker({
  label,
  id,
  error,
  registration,
  wrapperClassName,
  inputClassName,
  variant = 'outline',
  ...htmlProps
}: TimePickerProps) {
  const borderColor = error
    ? 'border-red-400'
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
      <input
        {...registration}
        {...htmlProps}
        id={id}
        type="time"
        step={1}
        className={clsx(
          variant === 'outline'
            ? `text-sm text-[#A5A5A5] bg-transparent focus:outline-none cursor-text w-full border-solid border-b-2 ${borderColor} pb-2 focus-within:border-[#B19B86] transition-colors duration-300 [&::-webkit-calendar-picker-indicator]:filter [&::-webkit-calendar-picker-indicator]:invert [&::-webkit-calendar-picker-indicator]:sepia [&::-webkit-calendar-picker-indicator]:saturate-[5] [&::-webkit-calendar-picker-indicator]:hue-rotate-[35deg] [&::-webkit-calendar-picker-indicator]:brightness-[0.9]`
            : variant === 'solid'
              ? `text-sm text-[#A5A5A5] bg-[#1a1a1a] focus:outline-none cursor-text w-full ${borderColor} border-[1px] border-opacity-10 rounded-2xl px-2 py-[10px] focus-within:border-[#B19B86] transition-colors duration-300 disabled:bg-[#272727] [&::-webkit-calendar-picker-indicator]:filter [&::-webkit-calendar-picker-indicator]:invert [&::-webkit-calendar-picker-indicator]:sepia [&::-webkit-calendar-picker-indicator]:saturate-[5] [&::-webkit-calendar-picker-indicator]:hue-rotate-[35deg] [&::-webkit-calendar-picker-indicator]:brightness-[0.9]`
              : '',
          inputClassName,
        )}
      />
      {error && <ErrorMessage message={error} />}
    </div>
  )
}
