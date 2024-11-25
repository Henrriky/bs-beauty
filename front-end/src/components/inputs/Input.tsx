import { HTMLInputTypeAttribute, InputHTMLAttributes } from 'react'
import THEME_CONFIG from '../../config/theme'

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  id: string
  type: HTMLInputTypeAttribute
  error?: string | null
}

export function Input(props: InputProps) {
  return (
    <div className="flex gap-3 flex-col items-start">
      <label className="text-sm text-[#D9D9D9]" htmlFor={props.id}>
        {props.label}
      </label>
      <input
        {...props}
        className={`text-sm text-[#A5A5A5] bg-transparent focus:outline-none cursor-text w-full border-solid border-b-2 
          ${props.error ? `border-[${THEME_CONFIG.colors.feedback.error}]` : 'border-[#3B3B3B]'} pb-2 focus-within:border-[#B19B86] transition-colors duration-300`}
        type={props.type}
        placeholder={props.placeholder}
      />
      {props.error && (
        <p
          className={`text-[${THEME_CONFIG.colors.feedback.error}] text-sm font-medium`}
        >
          {props.error}
        </p>
      )}
    </div>
  )
}
