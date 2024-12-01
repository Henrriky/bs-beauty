export interface ErrorMessageProps {
  message: string
}

export function ErrorMessage({ message }: ErrorMessageProps) {
  return <p className="text-[#CC3636] text-sm font-medium">{message}</p>
}
