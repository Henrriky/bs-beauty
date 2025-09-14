import { InputHTMLAttributes, ReactNode } from 'react'
import { UseFormRegisterReturn } from 'react-hook-form'
import { ErrorMessage } from '../feedback/ErrorMessage'
import clsx from 'clsx'

export interface CheckboxProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string | ReactNode
  id: string
  error?: string | null
  registration?: UseFormRegisterReturn
  wrapperClassName?: string | undefined
  inputClassName?: string | undefined
}

export function Checkbox({
  label,
  id,
  error,
  registration,
  wrapperClassName,
  inputClassName,
  ...htmlProps
}: CheckboxProps) {
  const borderColor = error ? 'border-[#CC3636]' : 'border-[#3B3B3B]'

  return (
    <div className={clsx('flex flex-col items-start gap-2', wrapperClassName)}>
      <label
        htmlFor={id}
        className="relative flex cursor-pointer items-center gap-3"
      >
        <input
          {...registration}
          {...htmlProps}
          id={id}
          type="checkbox"
          className={clsx(
            'peer h-5 w-5 shrink-0 cursor-pointer appearance-none rounded-md border-2 bg-transparent transition-all',
            'focus:outline-none focus:ring-2 focus:ring-[#B19B86] focus:ring-offset-2 focus:ring-offset-[#121212]',
            'checked:border-[#B19B86] checked:bg-[#B19B86]',
            borderColor,
            inputClassName,
          )}
        />
        <div className="pointer-events-none absolute left-0 top-0 flex h-5 w-5 items-center justify-center text-white opacity-0 transition-opacity peer-checked:opacity-100">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="h-4 w-4"
          >
            <path
              fillRule="evenodd"
              d="M19.916 4.626a.75.75 0 01.208 1.04l-9 13.5a.75.75 0 01-1.154.114l-6-6a.75.75 0 011.06-1.06l5.353 5.353 8.493-12.739a.75.75 0 011.04-.208z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        {label && <span className="text-sm text-[#D9D9D9]">{label}</span>}
      </label>
      {error && <ErrorMessage message={error} />}
    </div>
  )
}
