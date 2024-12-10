import { ReactNode } from 'react'
import expandArrow from '../../../assets/expand-arrow.svg'

interface ExpansiveItemProps {
  text: string
  node: ReactNode
  div: string
  expandedDiv: 'string' | null
  toggleDiv: () => void
}

function ExpansiveItem({
  text,
  node,
  div,
  expandedDiv,
  toggleDiv,
}: ExpansiveItemProps) {
  return (
    <div className="w-full mt-6">
      <button
        onClick={toggleDiv}
        className={`flex justify-center items-center`}
      >
        <img
          src={expandArrow}
          alt="Ícone de seta"
          className={`transition-transform duration-500 ${
            expandedDiv === div ? 'rotate-180' : 'rotate-0'
          }`}
        />
        <span className="text-[#B19B86] text-sm ml-[13px]">{text}</span>
      </button>
      {expandedDiv === div && node}
    </div>
  )
}

export default ExpansiveItem
