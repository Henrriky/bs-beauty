function BSBeautyLoading({ title = 'Carregando...' }: { title?: string }) {
  return (
    <div className="flex justify-center items-center gap-4 animate-pulse">
      <div className="w-4 h-4 border-2 border-t-2 border-transparent border-t-[#A4978A] rounded-full animate-spin"></div>
      <p className="text-sm text-[#A4978A] font-semibold">{title}</p>
    </div>
  )
}

export default BSBeautyLoading
