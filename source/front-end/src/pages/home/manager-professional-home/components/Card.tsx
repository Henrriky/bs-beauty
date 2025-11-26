import React, { ReactNode } from 'react'

type Props = {
  icon: ReactNode
  text: string
  count: string | number
  trend?: {
    value: number
    isPositive: boolean
  }
}

const Card: React.FC<Props> = ({ icon, text, count, trend }) => {
  return (
    <div className="bg-gradient-to-br from-secondary-800/50 to-secondary-900/30 backdrop-blur-sm rounded-xl p-6 border border-secondary-700/50 hover:border-secondary-600/50 transition-all duration-300 hover:shadow-lg hover:shadow-secondary-900/20 hover:-translate-y-1">
      <div className="flex items-start justify-between mb-4">
        <div className="p-3 bg-secondary-700/30 rounded-lg hover:bg-secondary-700/50 transition-colors duration-200">
          <div className="size-6 text-[#A4978A]">{icon}</div>
        </div>
        {trend && (
          <div
            className={`flex items-center gap-1 text-xs font-medium ${
              trend.isPositive ? 'text-green-400' : 'text-red-400'
            }`}
          >
            <span>{trend.isPositive ? '↑' : '↓'}</span>
            <span>{Math.abs(trend.value)}%</span>
          </div>
        )}
      </div>
      <div className="space-y-1">
        <p className="text-sm font-medium text-primary-200/70">{text}</p>
        <p className="text-2xl font-bold text-primary-100">{count}</p>
      </div>
    </div>
  )
}

export default Card
