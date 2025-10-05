import { ReactNode } from 'react'

export interface ErrorMessageProps {
  message: string | ReactNode
}

export function ErrorMessage({ message }: ErrorMessageProps) {
  return <p className="text-red-400 text-sm">{message}</p>
}
