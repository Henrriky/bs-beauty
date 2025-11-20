import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import DayAppointmentCard from './DayAppointmentCard'
import { Status as ApiStatus } from '../../../../../../store/appointment/types'

type Status = ApiStatus

type Item = {
  id: string
  status: Status
  start: Date
  durationMin: number | null
  customerName: string
  serviceName: string
  professionalName: string | null
}

type Props = {
  selectedDate: Date | null
  dayList: Item[]
  isManager: boolean
  viewAll: boolean
  legendIcon: (s: Status) => string
  prettyStatus: (s: Status) => string
  statusChip: (s: Status) => string
  isLoading: boolean
  isError: boolean
}

export default function DayPanel({
  selectedDate,
  dayList,
  isManager,
  viewAll,
  legendIcon,
  prettyStatus,
  statusChip,
  isLoading,
  isError,
}: Props) {
  return (
    <>
      <div className="flex items-center justify-between p-3 sm:p-4">
        <div className="text-[#595149] font-medium">
          {selectedDate
            ? format(selectedDate, "EEEE, dd 'de' LLL", { locale: ptBR })
            : 'Selecione um dia'}
        </div>
      </div>
      <div className="bg-[#595149] w-full h-0.5" />
      {isError && !isLoading && (
        <div className="p-4 text-sm text-red-300" role="alert">
          Erro ao carregar dados.
        </div>
      )}
      <div className="p-3 sm:p-4 space-y-2">
        {selectedDate && dayList.length > 0 ? (
          dayList.map((a) => (
            <DayAppointmentCard
              key={a.id}
              id={a.id}
              start={a.start}
              durationMin={a.durationMin}
              customerName={a.customerName}
              serviceName={a.serviceName}
              professionalName={a.professionalName}
              status={a.status}
              isManager={isManager}
              viewAll={viewAll}
              legendIcon={legendIcon}
              prettyStatus={prettyStatus}
              statusChip={statusChip}
              formatHour={(d) => format(d, 'HH:mm')}
            />
          ))
        ) : (
          <div className="text-primary-300 text-sm py-6 text-center">
            {selectedDate
              ? 'Sem agendamentos neste dia.'
              : 'Selecione um dia no calendário.'}
          </div>
        )}
      </div>
    </>
  )
}
