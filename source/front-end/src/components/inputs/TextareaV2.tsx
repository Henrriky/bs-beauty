import { forwardRef, TextareaHTMLAttributes } from 'react'
import clsx from 'clsx'

export interface TextareaProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  id: string
  error?: string
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ id, error, className, ...props }, ref) => {
    return (
      <div className="w-full">
        <textarea
          {...props}
          ref={ref}
          id={id}
          className={clsx(
            'w-full px-4 py-3 bg-primary-600 rounded-xl text-primary-0 placeholder-primary-200 focus:outline-none transition-colors duration-200 resize-none text-sm',
            error
              ? 'border border-red-400 focus:border-red-400 focus:ring-1 focus:ring-red-400'
              : 'border border-primary-500 focus:border-secondary-400 focus:ring-1 focus:ring-secondary-400',
            className,
          )}
        />
        {error && <p className="mt-1 text-sm text-red-400">{error}</p>}
      </div>
    )
  },
)

Textarea.displayName = 'Textarea'
