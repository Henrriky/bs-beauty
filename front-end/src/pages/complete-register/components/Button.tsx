import { ButtonHTMLAttributes, ReactNode } from 'react'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label: string | ReactNode
}

export function Button(props: ButtonProps) {
  return (
    <button
      {...props}
      className="bg-[#595149] text-[#D9D9D9] transition-all duration-300 ease-in-out items-center justify-center w-full text-sm py-3 rounded-3xl active:bg-[#3A3027] cursor"
    >
      {props.label}
    </button>
  )
}
