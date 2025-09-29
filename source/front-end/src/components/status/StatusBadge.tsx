interface StatusBadgeProps {
  text: string
  color: string
}

function StatusBadge(props: StatusBadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs text-${props.color}-700 bg-${props.color}-100 rounded border-[1px] border-${props.color}-200 border-opacity-25`}
    >
      <span className={`w-1.5 h-1.5 bg-${props.color}-500 rounded-full`}></span>
      {props.text}
    </span>
  )
}

export default StatusBadge
