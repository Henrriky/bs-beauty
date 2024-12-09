import { ButtonHTMLAttributes, ReactNode } from 'react'
import clsx from 'clsx'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label: string | ReactNode
  variant?: 'outline' | 'solid'
  outlineVariantBorderStyle?: 'solid' | 'dashed'
  className?: string
}

export function Button({
  label,
  variant = 'solid',
  outlineVariantBorderStyle = 'solid',
  className,
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
          ? `bg-none text-[#bebebe] transition-all duration-300 ease-in-out items-center justify-center w-full text-sm py-3 rounded-3xl active:bg-[#3A3027] cursor border-[#B19B86] ${outlineBorderStyle} border-[1.5px] hover:bg-[#B19B86] hover:bg-opacity-10 cursor-pointer`
          : variant === 'solid'
            ? 'bg-[#595149] text-[#D9D9D9] transition-all duration-300 ease-in-out items-center justify-center w-full text-sm py-3 rounded-3xl active:bg-[#3A3027] cursor hover:bg-[#3A3027]'
            : '',
        className,
      )}
    >
      {label}
    </button>
  )
}
