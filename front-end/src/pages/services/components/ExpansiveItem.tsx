import { ReactNode, useState } from 'react'
import expandArrow from '../../../assets/expand-arrow.svg'

interface ExpansiveItemProps {
  text: string
  top: string
  node: ReactNode
}

function ExpansiveItem({ text, top, node }: ExpansiveItemProps) {
  const [isExpanded, setExpanded] = useState(false)

  const toggleRotation = () => {
    setExpanded(!isExpanded)
  }

  return (
    <div className="w-full">
      <button
        onClick={toggleRotation}
        className={`relative left-[20px] flex justify-center items-center`}
        style={{ top }}
      >
        <img
          src={expandArrow}
          alt="Ícone de seta"
          className={`transition-transform duration-500 ${
            isExpanded ? 'rotate-180' : 'rotate-0'
          }`}
        />
        <span className="text-[#B19B86] text-sm ml-[13px]">{text}</span>
      </button>
      {isExpanded && node}
    </div>
  )
}

export default ExpansiveItem
