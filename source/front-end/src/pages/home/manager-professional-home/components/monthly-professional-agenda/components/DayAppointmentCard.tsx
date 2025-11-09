import { Status as ApiStatus } from '../../../../../../store/appointment/types'

type Status = ApiStatus

type Props = {
  id: string
  start: Date
  durationMin: number | null
  customerName: string
  serviceName: string
  professionalName: string | null
  status: Status
  isManager: boolean
  viewAll: boolean

  legendIcon: (s: Status) => string
  prettyStatus: (s: Status) => string
  statusChip: (s: Status) => string

  formatHour: (d: Date) => string
}

function DayAppointmentCard({
  start,
  durationMin,
  customerName,
  serviceName,
  professionalName,
  status,
  isManager,
  viewAll,
  legendIcon,
  prettyStatus,
  statusChip,
  formatHour,
}: Props) {
  return (
    <article className="rounded-md bg-[#3A3027]/60 p-3 flex items-start gap-3">
      <div className="text-primary-0 text-sm w-16 shrink-0">
        {formatHour(start)}
        <br />
        {durationMin ? (
          <span className="text-primary-0 text-xs">({durationMin}m)</span>
        ) : null}
      </div>

      <div className="flex-1">
        <div className="text-primary-0 text-[15px] font-medium">
          {customerName} • {serviceName}
        </div>

        {isManager && viewAll && professionalName && (
          <div className="text-primary-0 text-sm mt-0.5">
            Profissional: {professionalName}
          </div>
        )}

        <div className="mt-1">
          <span
            className={`px-1.5 py-0.5 text-[11px] rounded ${statusChip(status)}`}
          >
            {legendIcon(status)} {prettyStatus(status)}
          </span>
        </div>
      </div>
    </article>
  )
}

export default DayAppointmentCard
