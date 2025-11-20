import { ReactNode } from 'react'

interface ChartContainerProps {
  title: string
  children: ReactNode
}

function ChartContainer({ title, children }: ChartContainerProps) {
  return (
    <div className="bg-[#262626] rounded-lg">
      <h2 className="text-lg font-semibold mt-6 mb-4 text-[#D9D9D9] text-center">
        {title}
      </h2>
      <div className="w-full">{children}</div>
    </div>
  )
}

export default ChartContainer
