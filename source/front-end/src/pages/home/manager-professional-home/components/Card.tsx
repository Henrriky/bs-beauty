import React, { ReactNode } from 'react'

type Props = {
  icon: ReactNode
  text: string
  count: string | number
}

const Card: React.FC<Props> = ({ icon, text, count }) => {
  return (
    <div className="text-primary-100 flex items-center gap-2.5 ">
      <div className="text-[#A4978A] size-8 mr-2">{icon}</div>
      <p className="font-medium text-[12px] text-[#D9D9D9]">{text}</p>
      <div className="ml-auto text-[#D9D9D9]">{count}</div>
    </div>
  )
}

export default Card
