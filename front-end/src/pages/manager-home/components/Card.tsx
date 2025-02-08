import React, { ReactNode } from 'react'

type Props = {
  icon: ReactNode
  text: string
  count: number
}

const Card: React.FC<Props> = ({ icon, text, count }) => {
  return (
    <div className="text-primary-100 flex items-center gap-2.5 ">
      <div className="text-secondary-400 size-8 mr-2">{icon}</div>
      <p className="font-medium text-[12px]">{text}</p>
      <div className="ml-auto">{count}</div>
    </div>
  )
}

export default Card
