import { ReactNode } from 'react'

interface ChartContainerProps {
  title: string
  children: ReactNode
}

function ChartContainer({ title, children }: ChartContainerProps) {
  return (
    <div className="bg-[#262626] rounded-lg p-6">
      <h2 className="text-lg font-semibold mb-4 text-[#D9D9D9] text-center">
        {title}
      </h2>
      <div className="w-full h-[400px]">{children}</div>
    </div>
  )
}

export default ChartContainer
