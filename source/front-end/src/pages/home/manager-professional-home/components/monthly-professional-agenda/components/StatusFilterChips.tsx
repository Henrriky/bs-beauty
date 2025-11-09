import { Status as ApiStatus } from '../../../../../../store/appointment/types'

type Status = ApiStatus

type Props = {
  statuses: Status[]
  selected: Status[]
  onToggle: (status: Status) => void
  onMarkAll: () => void
  onClear: () => void
  dense?: boolean

  legendIcon: (s: Status) => string
  prettyStatus: (s: Status) => string
  statusChip: (s: Status) => string
}

function StatusFilterChips({
  statuses,
  selected,
  onToggle,
  onMarkAll,
  onClear,
  dense = false,
  legendIcon,
  prettyStatus,
  statusChip,
}: Props) {
  return (
    <>
      <div className={`text-sm text-primary-300 ${dense ? 'mb-1.5' : 'mb-2'}`}>Estado do agendamento</div>

      <div className="flex flex-wrap gap-2">
        {statuses.map((s) => {
          const active = selected.includes(s)
          return (
            <button
              key={s}
              type="button"
              onClick={() => onToggle(s)}
              className={`px-2 py-1 rounded text-xs border ${active
                ? 'bg-[#595149] text-[#D9D9D9] border-transparent'
                : 'bg-black/40 text-[#D9D9D9] border-[#6a5f54]'
                }`}
            >

              <span
                className={`inline-flex items-center justify-center rounded px-1 ${statusChip(s)}`}
                aria-hidden="true"
              >
                {legendIcon(s)}
              </span>
              <span className="ml-1">{prettyStatus(s)}</span>
            </button>
          )
        })}
      </div>

      <div className={`flex gap-2 ${dense ? 'mt-2' : 'mt-3'}`}>
        <button type="button" className="px-2 py-1 rounded text-xs text-primary-300 hover:bg-black/20" onClick={onMarkAll}>
          Marcar todos
        </button>
        <button type="button" className="px-2 py-1 rounded text-xs text-primary-300 hover:bg-black/20" onClick={onClear}>
          Limpar
        </button>
      </div>
    </>
  )
}

export default StatusFilterChips
