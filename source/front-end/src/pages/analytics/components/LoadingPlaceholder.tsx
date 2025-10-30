interface LoadingPlaceholderProps {
  message?: string
}

function LoadingPlaceholder({ message = 'Carregando...' }: LoadingPlaceholderProps) {
  return (
    <div className="h-full flex items-center justify-center text-[#979797]">
      {message}
    </div>
  )
}

export default LoadingPlaceholder
