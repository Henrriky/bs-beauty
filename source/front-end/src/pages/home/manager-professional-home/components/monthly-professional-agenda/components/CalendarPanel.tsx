import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline'
import Calendar from 'react-calendar'
import { isSameDay, startOfMonth } from 'date-fns'
import { Status as ApiStatus } from '../../../../../../store/appointment/types'

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

function buildStatusEntries<TStatus extends string>(
  items: Array<{ status: TStatus }>,
  applied: TStatus[]
): Array<[TStatus, number]> {
  const counts: Partial<Record<TStatus, number>> = {}
  for (const it of items) {
    if (!applied.length || applied.includes(it.status)) {
      counts[it.status] = (counts[it.status] ?? 0) + 1
    }
  }
  return (Object.entries(counts) as Array<[TStatus, number]>).sort((a, b) => b[1] - a[1])
}

function tileClasses(date: Date, selectedDate: Date | null, currentMonth: Date) {
  const c = ['rc-tile', 'rounded-[10px]']
  if (isSameDay(date, new Date())) c.push('rc-is-today')
  if (selectedDate && isSameDay(date, selectedDate)) c.push('rc-is-selected')
  if (date.getMonth() !== currentMonth.getMonth()) c.push('rc-is-outside')
  return c.join(' ')
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
        className="react-calendar rcScoped text-[#A4978A] w-full"
        locale="pt-BR"
        showNeighboringMonth={false}
        minDetail="month"
        prev2Label={null}
        next2Label={null}
        prevLabel={<ChevronLeftIcon className="size-5" />}
        nextLabel={<ChevronRightIcon className="size-5" />}

        /* mantém o label como estava, para zero impacto visual */
        navigationLabel={({ label, view }) =>
          view === 'month'
            ? (
              <span className="text-[#595149]">
                {`${label.split(' ')[0].replace(/^\w/, c => c.toUpperCase())} - ${label.split(' ')[2]}`}
              </span>
            )
            : label
        }

        formatShortWeekday={(_, date) =>
          date.toLocaleDateString('pt-BR', { weekday: 'narrow' }).toUpperCase()
        }

        activeStartDate={currentMonth}
        onActiveStartDateChange={({ activeStartDate }) => {
          if (activeStartDate) onChangeMonth(startOfMonth(activeStartDate))
        }}

        value={selectedDate ?? undefined}
        onClickDay={(value) => onSelectDate(value as Date)}

        tileClassName={({ date, view }) => (view !== 'month' ? '' : tileClasses(date, selectedDate, currentMonth))}

        tileContent={({ date, view }) => {
          if (view !== 'month') return null

          const bucket = byDay.get(dayKey(date))
          if (!bucket) return null

          const entries = buildStatusEntries(bucket.items, appliedStatuses)
          if (!entries.length) return null

          const visible = entries.slice(0, 3)
          const extra = entries.length - visible.length

          return (
            <div className="rc-chipwrap">
              {visible.map(([k, v]) => (
                <span key={k} className={`rc-chip ${statusChip(k)}`}>
                  {legendIcon(k)} {v}
                </span>
              ))}
              {extra > 0 && (
                <span className="rc-chip bg-black/20 text-primary-200">+{extra}</span>
              )}
            </div>
          )
        }}
      />
    </div>
  )
}
