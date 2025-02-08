import { HTMLInputTypeAttribute, InputHTMLAttributes } from 'react'
import { UseFormRegisterReturn } from 'react-hook-form'
import { ErrorMessage } from '../feedback/ErrorMessage'
import clsx from 'clsx'

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  id: string
  type: HTMLInputTypeAttribute
  error?: string | null
  registration?: UseFormRegisterReturn
  variant?: 'solid' | 'outline'
  wrapperClassName?: string | undefined
  inputClassName?: string | undefined
}

export function Input({
  label,
  id,
  type,
  error,
  registration,
  wrapperClassName,
  inputClassName,
  variant = 'outline',
  ...htmlProps
}: InputProps) {
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
      <input
        {...registration}
        {...htmlProps}
        id={id}
        type={type}
        className={clsx(
          variant === 'outline'
            ? `text-sm text-[#A5A5A5] bg-transparent focus:outline-none cursor-text w-full border-solid border-b-2 ${borderColor} pb-2 focus-within:border-[#B19B86] transition-colors duration-300`
            : variant === 'solid'
              ? `w-full text-sm text-[#A5A5A5] bg-[#1a1a1a] focus:outline-none cursor-text ${borderColor} border-[1px] border-opacity-10 rounded-2xl px-2 py-[10px] focus-within:border-[#B19B86] transition-colors duration-300 `
              : '',
          inputClassName,
        )}
      />
      {error && <ErrorMessage message={error} />}
    </div>
  )
}
