interface StatusBadgeProps {
  text: string
  color?: 'red' | 'green' | 'amber' | 'gray'
  className?: string
}

const colorsMap = {
  red: {
    text: 'text-red-700',
    bg: 'bg-red-100',
    border: 'border-red-200',
    dot: 'bg-red-500',
  },
  green: {
    text: 'text-green-700',
    bg: 'bg-green-100',
    border: 'border-green-200',
    dot: 'bg-green-500',
  },
  amber: {
    text: 'text-amber-700',
    bg: 'bg-amber-100',
    border: 'border-amber-200',
    dot: 'bg-amber-500',
  },
  gray: {
    text: 'text-gray-700',
    bg: 'bg-gray-100',
    border: 'border-gray-200',
    dot: 'bg-gray-500',
  },
}

function StatusBadge(props: StatusBadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs ${colorsMap[props.color || 'gray'].text} ${colorsMap[props.color || 'gray'].bg} rounded border-[1px] ${colorsMap[props.color || 'gray'].border} border-opacity-25 ${props.className}`}
    >
      <span
        className={`w-1.5 h-1.5 ${colorsMap[props.color || 'gray'].dot} rounded-full`}
      ></span>
      {props.text}
    </span>
  )
}

export default StatusBadge
