import { useState, useMemo, useRef } from 'react'
import { XMarkIcon } from '@heroicons/react/24/solid'

const STATUS_OPTIONS = [
  { value: 'PENDING', label: 'Pendente' },
  { value: 'CONFIRMED', label: 'Confirmado' },
  { value: 'CANCELLED', label: 'Cancelado' },
  { value: 'FINISHED', label: 'Finalizado' },
]

type StatusFilterInputProps = {
  value?: string[]
  onChange: (value: string[]) => void
}

export default function StatusFilterInput({
  value = [],
  onChange,
}: StatusFilterInputProps) {
  const [selectOpen, setSelectOpen] = useState(false)
  const selectRef = useRef<HTMLSelectElement | null>(null)

  const availableStatusesInDropdown = useMemo(() => {
    return STATUS_OPTIONS.filter(
      (status) => !value.some((selected) => selected === status.value),
    )
  }, [value])

  const handleAddStatus = (statusValue: string) => {
    if (statusValue && !value.includes(statusValue)) {
      onChange([...value, statusValue])
    }
  }

  const handleRemoveStatus = (statusValue: string) => {
    const newSelectedStatuses = value.filter((s) => s !== statusValue)
    onChange(newSelectedStatuses)
  }

  const findLabelForValue = (statusValue: string) => {
    const status = STATUS_OPTIONS.find((s) => s.value === statusValue)
    return status ? status.label : statusValue
  }

  return (
    <div className="w-full">
      <label className="block text-sm text-[#979797] mb-2">
        Filtrar por Status
      </label>

      {value.length > 0 && (
        <div className="flex min-h-[48px] flex-wrap items-center border border-[#535353] gap-2 rounded-lg p-2 bg-[#1E1E1E] mb-2">
          {value.map((status) => (
            <span
              key={status}
              className="flex items-center gap-2 rounded-full bg-[#A4978A] px-3 py-1 text-sm text-[#1E1E1E] font-medium animate-fade-in"
            >
              {findLabelForValue(status)}
              <button
                type="button"
                onClick={() => handleRemoveStatus(status)}
                className="flex h-4 w-4 items-center justify-center rounded-full text-[#1E1E1E] transition-colors hover:bg-[#CC3636]"
                aria-label={`Remover ${findLabelForValue(status)}`}
              >
                <XMarkIcon className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
      )}

      <div className="relative">
        <select
          ref={selectRef}
          id="status-filter-select"
          value=""
          onChange={(e) => {
            handleAddStatus(e.target.value)
            setSelectOpen(false)
          }}
          onFocus={() => setSelectOpen(true)}
          onMouseDown={() => setSelectOpen((s) => !s)}
          onBlur={() => setSelectOpen(false)}
          className="appearance-none h-12 w-full cursor-pointer rounded-lg border border-[#535353] bg-[#1E1E1E] px-4 pr-10 text-[#D9D9D9] focus:border-[#A4978A] focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 transition-colors"
          disabled={availableStatusesInDropdown.length === 0}
        >
          <option value="" disabled className="text-[#979797]">
            {availableStatusesInDropdown.length > 0
              ? 'Adicionar status ao filtro'
              : 'Todos os status selecionados'}
          </option>
          {availableStatusesInDropdown.map((status) => (
            <option
              key={status.value}
              value={status.value}
              className="bg-[#262626] text-[#D9D9D9]"
            >
              {status.label}
            </option>
          ))}
        </select>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={`pointer-events-none absolute top-1/2 transform -translate-y-1/2 right-4 h-5 w-5 text-[#979797] transition-transform duration-150 ${selectOpen ? 'rotate-180' : 'rotate-0'}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </div>
    </div>
  )
}
