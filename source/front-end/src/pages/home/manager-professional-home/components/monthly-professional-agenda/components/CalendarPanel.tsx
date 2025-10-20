import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline'
import Calendar from 'react-calendar'
import { startOfMonth } from 'date-fns'
import { Status as ApiStatus } from '../../../../../../store/appointment/types'
import {
  buildStatusCounts,
  generateTileClasses,
  baseCalendarConfig,
  formatShortWeekday
} from '../shared/calendar-utils'
import { renderStatusChips } from '../shared/calendar-components'

type Status = ApiStatus

type CalendarItem = {
  id: string
  status: Status
  start: Date
  durationMin: number | null
  customerName: string
  serviceName: string
  professionalName: string | null
}
type ByDayMap = Map<string, { date: Date; items: CalendarItem[] }>

type Props = {
  currentMonth: Date
  selectedDate: Date | null
  onChangeMonth: (d: Date) => void
  onSelectDate: (d: Date) => void
  byDay: ByDayMap
  appliedStatuses: Status[]
  legendIcon: (s: Status) => string
  statusChip: (s: Status) => string
  isLoading: boolean
  isError: boolean

  dayKeyFn?: (d: Date) => string
}

function defaultDayKey(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate()).toDateString()
}

export default function CalendarPanel({
  currentMonth,
  selectedDate,
  onChangeMonth,
  onSelectDate,
  byDay,
  appliedStatuses,
  legendIcon,
  statusChip,
  isLoading,
  isError,
  dayKeyFn,
}: Props) {
  const dayKey = dayKeyFn ?? defaultDayKey

  return (
    <div className="rcWrap w-full">
      {isLoading && (
        <div className="px-4 py-3 text-sm text-primary-300" role="status" aria-live="polite">
          Carregando agendamentos…
        </div>
      )}
      {isError && !isLoading && (
        <div className="px-4 py-3 text-sm text-red-300" role="alert">
          Erro ao carregar dados.
        </div>
      )}

      <Calendar
        {...baseCalendarConfig}
        prevLabel={<ChevronLeftIcon className="size-5" />}
        nextLabel={<ChevronRightIcon className="size-5" />}

        navigationLabel={({ label, view }) =>
          view === 'month'
            ? (
              <span className="text-[#595149]">
                {`${label.split(' ')[0].replace(/^\w/, c => c.toUpperCase())} - ${label.split(' ')[2]}`}
              </span>
            )
            : label
        }

        formatShortWeekday={formatShortWeekday}

        activeStartDate={currentMonth}
        onActiveStartDateChange={({ activeStartDate }) => {
          if (activeStartDate) onChangeMonth(startOfMonth(activeStartDate))
        }}

        value={selectedDate ?? undefined}
        onClickDay={(value) => onSelectDate(value as Date)}

        tileClassName={({ date, view }) => (
          view !== 'month' ? '' : generateTileClasses(date, selectedDate, currentMonth)
        )}

        tileContent={({ date, view }) => {
          if (view !== 'month') return null

          const bucket = byDay.get(dayKey(date))
          if (!bucket) return null

          const statusCounts = buildStatusCounts(bucket.items, appliedStatuses)

          return renderStatusChips(statusCounts, statusChip, legendIcon)
        }}
      />
    </div>
  )
}
