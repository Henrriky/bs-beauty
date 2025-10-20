import {
  ChevronLeftIcon,
  ChevronRightIcon,
  FunnelIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline'

type Props = {
  monthLabel: string
  onPrevMonth: () => void
  onNextMonth: () => void
  onToday: () => void
  onCloseModal: () => void
  isManager: boolean
  viewAll: boolean
  onToggleViewAll: () => void
  onOpenFilter: () => void
}

function MonthlyAgendaHeader({
  monthLabel,
  onPrevMonth,
  onNextMonth,
  onToday,
  onCloseModal,
  isManager,
  viewAll,
  onToggleViewAll,
  onOpenFilter,
}: Props) {
  return (
    <div
      className="
        flex items-center gap-2 p-3 sm:p-4
        border-b border-[#595149]
      "
    >
      {/* ESQUERDA: setas coladas ao mês */}
      <div className="flex items-center gap-1 sm:gap-2 flex-1 min-w-0">
        <button
          className="p-2 rounded hover:bg-black/20 focus:outline-none focus:ring-2 focus:ring-[#A4978A]"
          onClick={onPrevMonth}
          aria-label="Mês anterior"
        >
          <ChevronLeftIcon className="size-5" />
        </button>

        <div
          className="
            mx-1 sm:mx-2 font-medium text-[#595149]
            min-w-0 truncate
          "
          title={monthLabel}
        >
          {monthLabel.charAt(0).toUpperCase() + monthLabel.slice(1)}
        </div>

        <button
          className="p-2 rounded hover:bg-black/20 focus:outline-none focus:ring-2 focus:ring-[#A4978A]"
          onClick={onNextMonth}
          aria-label="Próximo mês"
        >
          <ChevronRightIcon className="size-5" />
        </button>
      </div>

      {/* DIREITA: ações (não sobrepõe nada) */}
      <div className="flex items-center gap-1 sm:gap-2 shrink-0">
        <button
          className="px-2 sm:px-3 py-1.5 text-sm rounded bg-[#595149] text-primary-0 hover:opacity-80"
          onClick={onToday}
        >
          Hoje
        </button>

        {isManager && (
          <button
            type="button"
            onClick={onToggleViewAll}
            className={`px-2 sm:px-3 py-1.5 text-sm rounded ${viewAll
                ? 'bg-[#595149] text-primary-0'
                : 'text-[#595149] hover:bg-black/20'
              }`}
            title="Visualizar todos os agendamentos"
          >
            <span className="sm:hidden">Todos</span>
            <span className="hidden sm:inline">Todos</span>
          </button>
        )}

        <button
          onClick={onOpenFilter}
          className="inline-flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 text-sm rounded hover:bg-black/20 text-[#595149]"
          title="Filtros"
          aria-label="Filtros"
        >
          <FunnelIcon className="size-5" />
          <span className="hidden sm:inline">Filtros</span>
        </button>

        <button
          onClick={onCloseModal}
          className="p-2 rounded hover:bg-black/20"
          aria-label="Fechar"
        >
          <XMarkIcon className="size-5" />
        </button>
      </div>
    </div>
  )
}

export default MonthlyAgendaHeader
