import { ButtonHTMLAttributes, ReactNode } from 'react'
import clsx from 'clsx'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label: string | ReactNode
  variant?: 'outline' | 'solid' | 'text-only'
  outlineVariantBorderStyle?: 'solid' | 'dashed'
  className?: string
  borderColor?: string
}

export function Button({
  label,
  variant = 'solid',
  outlineVariantBorderStyle = 'solid',
  className,
  borderColor,
  ...props
}: ButtonProps) {
  // This ugly conditional is being applied because of a behavior in tailwind that does not dynamically identify classes -> https://tailwindcss.com/docs/content-configuration#class-detection-in-depth
  const outlineBorderStyle =
    outlineVariantBorderStyle === 'solid'
      ? 'border-solid'
      : outlineVariantBorderStyle === 'dashed'
        ? 'border-dashed'
        : ''

  return (
    <button
      {...props}
      className={clsx(
        variant === 'outline'
          ? `bg-none text-[#bebebe] transition-all duration-300 ease-in-out items-center justify-center w-full text-sm py-3 rounded-3xl active:bg-[#3A3027] cursor ${borderColor || 'border-[#B19B86]'} ${outlineBorderStyle} border-[1.5px] hover:bg-[#B19B86] hover:bg-opacity-10 cursor-pointer`
          : variant === 'solid'
            ? 'bg-secondary-400 text-primary-0 transition-all duration-300 ease-in-out items-center justify-center w-full text-sm py-3 rounded-3xl active:bg-[#3A3027] cursor hover:bg-[#3A3027]'
            : variant === 'text-only'
              ? `relative ${borderColor || 'border-[#B19B86]'} text-[#A4978A] transition-all duration-300 ease-in-out justify-center w-fit text-sm active:text-[#a5a5a5] hover:text-[#B19B86] py-1 before:absolute before:bottom-0 before:left-0 before:h-[1px] before:w-0 before:bg-[#B19B86] before:transition-all before:duration-300 hover:before:w-full`
              : '',
        className,
      )}
    >
      {label}
    </button>
  )
}
