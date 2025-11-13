export function renderStatusChips<TStatus extends string>(
  statusCounts: Array<[TStatus, number]>,
  statusChip: (status: TStatus) => string,
  legendIcon: (status: TStatus) => string,
  maxVisible: number = 3,
): JSX.Element | null {
  if (!statusCounts.length) return null

  const visible = statusCounts.slice(0, maxVisible)
  const extra = statusCounts.length - visible.length

  return (
    <div className="rc-chipwrap">
      {visible.map(([status, count]) => (
        <span key={status} className={`rc-chip ${statusChip(status)}`}>
          {legendIcon(status)} {count}
        </span>
      ))}
      {extra > 0 && (
        <span className="rc-chip bg-black/20 text-primary-200">+{extra}</span>
      )}
    </div>
  )
}
