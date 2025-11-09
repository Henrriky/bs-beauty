type SectionDividerProps = {
  widthClass?: string
  colorClass?: string
  heightClass?: string
  marginTopClass?: string
}

export function SectionDivider({
  widthClass = 'w-1/2',
  colorClass = 'bg-[#595149]',
  heightClass = 'h-0.5',
  marginTopClass = 'mt-2',
}: SectionDividerProps) {
  return (
    <div
      className={`${colorClass} ${widthClass} ${heightClass} ${marginTopClass}`}
    />
  )
}
