type BSBeautyLoadingProps = {
  title?: string
  className?: string
  spinnerClassName?: string
  textClassName?: string
}

function BSBeautyLoading({
  title = 'Carregando...',
  className,
  spinnerClassName,
  textClassName,
}: BSBeautyLoadingProps) {
  return (
    <div className={`flex justify-center items-center gap-4 animate-pulse ${className}`}>
      <div className={`w-4 h-4 border-2 border-t-2 border-transparent border-t-[#A4978A] rounded-full animate-spin ${spinnerClassName}`}></div>
      <p className={`text-sm text-[#A4978A] font-semibold ${textClassName}`}>{title}</p>
    </div>
  )
}

export default BSBeautyLoading
