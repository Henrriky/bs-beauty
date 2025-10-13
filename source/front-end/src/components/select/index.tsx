import { SelectHTMLAttributes } from 'react'

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
}

export function Select({ label, error, className, ...props }: SelectProps) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <select
        className={`w-full h-[42px] px-3 pe-8 bg-transparent border border-[#B19B86] rounded-md shadow-sm focus:outline-none focus:ring-[#B19B86] focus:border-[#B19B86] text-[#bebebe] appearance-none ${
          error ? 'border-red-500' : ''
        } ${className}`}
        style={{
          backgroundImage: `url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' fill='%23B19B86' viewBox='0 0 24 24'><path d='M7 10l5 5 5-5z'/></svg>")`,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'right 12px center',
          backgroundSize: '20px',
        }}
        {...props}
      />
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  )
}
