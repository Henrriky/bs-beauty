import { ReactNode } from 'react'

export interface ErrorMessageProps {
  message: string | ReactNode
}

export function ErrorMessage({ message }: ErrorMessageProps) {
  return <p className="text-[#CC3636] text-sm font-medium">{message}</p>
}
