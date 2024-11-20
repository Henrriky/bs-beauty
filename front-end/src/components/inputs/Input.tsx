import { HTMLInputTypeAttribute, InputHTMLAttributes } from 'react'

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  name: string
  id: string
  type: HTMLInputTypeAttribute
}

export function Input(props: InputProps) {
  return (
    <div className="flex gap-3 flex-col items-start border-b-2 border-[#3B3B3B] pb-2 focus-within:border-[#B19B86] duration-300">
      <label className="text-sm text-[#D9D9D9]" htmlFor={props.id}>
        {props.label}
      </label>
      <input
        className="text-sm text-[#A5A5A5] border-none bg-transparent focus:outline-none cursor-text w-full"
        {...props}
        type={props.type}
        name={props.name}
        placeholder={props.placeholder}
      />
    </div>
  )
}
