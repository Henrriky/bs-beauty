import { Status as ApiStatus } from '../../../../../../store/appointment/types'
import { Link } from 'react-router-dom'
import { PencilSquareIcon, MagnifyingGlassCircleIcon } from '@heroicons/react/24/outline'
import { Button } from '../../../../../../components/button/Button'

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
  id,
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
  const isSchedulled =
    status === 'PENDING' ||
    status === 'CONFIRMED' ||
    status === 'RESCHEDULED'

  return (
    <article className="rounded-md bg-[#3A3027]/60 p-3 flex items-start gap-3">
      <div className="text-primary-0 text-sm w-16 shrink-0">
        {formatHour(start)}<br />
        {durationMin ? <span className="text-primary-0 text-xs">({durationMin}m)</span> : null}
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

        <div className="mt-1 flex  justify-between items-center gap-2 flex-wrap">
          <span className={`px-1.5 py-0.5 text-[11px] rounded ${statusChip(status)}`}>
            {legendIcon(status)} {prettyStatus(status)}
          </span>

          <Link to={`/appointments/${id}?action=${isSchedulled ? 'edit' : 'view'}`}>
            <Button
              className="flex items-center gap-1 text-[#d9d9d9] text-sm font-semibold !pt-0 !pb-0"
              variant="text-only"
              label={
                <>
                  {isSchedulled ? (
                    <>
                      <PencilSquareIcon className="size-5 text-[#d9d9d9]" />
                      Editar
                    </>
                  ) : (
                    <>
                      <MagnifyingGlassCircleIcon className="size-5 text-[#d9d9d9]" />
                      Visualizar
                    </>
                  )}
                </>
              }
            />
          </Link>
        </div>
      </div>
    </article>
  )
}

export default DayAppointmentCard
