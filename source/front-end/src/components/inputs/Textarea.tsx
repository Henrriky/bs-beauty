import { TextareaHTMLAttributes, ReactNode } from 'react'
import { UseFormRegisterReturn } from 'react-hook-form'
import { ErrorMessage } from '../feedback/ErrorMessage'
import clsx from 'clsx'

export interface TextareaProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string | ReactNode
  id: string
  error?: string | null
  registration?: UseFormRegisterReturn
  wrapperClassName?: string
  textareaClassName?: string
}

export function Textarea({
  label,
  id,
  error,
  registration,
  wrapperClassName,
  textareaClassName,
  ...htmlProps
}: TextareaProps) {
  const borderColor = error ? 'border-[#CC3636]' : 'border-[#3B3B3B]'

  return (
    <div className={clsx('flex gap-3 flex-col items-start', wrapperClassName)}>
      {label && (
        <label className="text-sm text-[#D9D9D9]" htmlFor={id}>
          {label}
        </label>
      )}
      <textarea
        {...registration}
        {...htmlProps}
        id={id}
        className={clsx(
          `w-full text-sm text-[#A5A5A5] bg-[#1a1a1a] focus:outline-none cursor-text ${borderColor} border-[1px] border-opacity-10 rounded-2xl px-2 py-[10px] focus-within:border-[#B19B86] transition-colors duration-300 disabled:bg-[#272727] h-20 resize-none`,
          textareaClassName,
        )}
      />

      {error && <ErrorMessage message={error} />}
    </div>
  )
}