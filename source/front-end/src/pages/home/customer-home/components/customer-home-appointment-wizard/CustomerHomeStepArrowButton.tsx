import { ChevronRightIcon } from '@heroicons/react/16/solid'

type StepArrowButtonProps = {
  show: boolean
  onClick?: () => void
}

function CustomerHomeStepArrowButton({ show, onClick }: StepArrowButtonProps) {
  if (!show) return null

  return (
    <button
      type="button"
      className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center justify-center bg-[#3A3027] rounded-full p-2 hover:bg-[#4e483f] transition-colors"
      onClick={(e) => {
        e.stopPropagation()
        e.preventDefault()
        onClick?.()
      }}
    >
      <ChevronRightIcon className="size-6 text-[#A4978A]" />
    </button>
  )
}

export default CustomerHomeStepArrowButton
