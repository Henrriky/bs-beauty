import { HTMLInputTypeAttribute, InputHTMLAttributes } from 'react'
import { UseFormRegisterReturn } from 'react-hook-form'

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  id: string
  type: HTMLInputTypeAttribute
  error?: string | null
  registration?: UseFormRegisterReturn
}

export function Input({
  label,
  id,
  type,
  error,
  registration,
  ...htmlProps
}: InputProps) {
  return (
    <div className="flex gap-3 flex-col items-start">
      <label className="text-sm text-[#D9D9D9]" htmlFor={id}>
        {label}
      </label>
      <input
        {...registration}
        {...htmlProps}
        id={id}
        type={type}
        className={`text-sm text-[#A5A5A5] bg-transparent focus:outline-none cursor-text w-full border-solid border-b-2 
          ${error ? 'border-[#CC3636]' : 'border-[#3B3B3B]'} pb-2 focus-within:border-[#B19B86] transition-colors duration-300`}
      />
      {error && <p className="text-[#CC3636] text-sm font-medium">{error}</p>}
    </div>
  )
}
