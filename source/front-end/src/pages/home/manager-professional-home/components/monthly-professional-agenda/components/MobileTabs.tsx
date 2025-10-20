// source/front-end/src/pages/home/manager-professional-home/components/monthly-professional-agenda/MobileTabs.tsx
type Props = {
  activeTab: 'calendar' | 'day'
  onChange: (tab: 'calendar' | 'day') => void
  hasSelectedDate: boolean
}

export default function MobileTabs({ activeTab, onChange, hasSelectedDate }: Props) {
  return (
    <div className="sm:hidden flex border-b border-[#595149]">
      <button
        className={`flex-1 py-2 text-sm ${activeTab === 'calendar'
          ? 'text-secondary-300 border-b-2 border-secondary-300'
          : 'text-primary-300'
          }`}
        onClick={() => onChange('calendar')}
      >
        Calendário
      </button>
      <button
        className={`flex-1 py-2 text-sm ${activeTab === 'day'
          ? 'text-secondary-300 border-b-2 border-secondary-300'
          : 'text-primary-300'
          }`}
        onClick={() => onChange('day')}
        disabled={!hasSelectedDate}
      >
        Dia
      </button>
    </div>
  )
}
