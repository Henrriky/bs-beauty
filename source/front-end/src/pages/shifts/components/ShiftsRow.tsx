import { CheckIcon } from '@heroicons/react/16/solid'

const dayId = (day: string) =>
  `busy-${day}`
    .toLowerCase()
    .normalize('NFD').replace(/\p{Diacritic}/gu, '')
    .replace(/\s+/g, '-')

interface EditableShift {
  shiftStart: string
  shiftEnd: string
  isBusy: boolean
}

interface ShiftsRowProps {
  weekDays: string[]
  editableShifts: Record<string, EditableShift>
  setEditableShifts: React.Dispatch<
    React.SetStateAction<Record<string, EditableShift>>
  >
}

const ShiftsRow = ({
  weekDays,
  editableShifts,
  setEditableShifts,
}: ShiftsRowProps) => {
  const toggleIsBusy = (day: string, checked: boolean) => {
    setEditableShifts((prev) => ({
      ...prev,
      [day]: {
        ...(prev[day] ?? { shiftStart: '00:00', shiftEnd: '00:00', isBusy: true }),
        isBusy: !checked,
      },
    }))
  }

  return (
    <>
      <div className="flex font-semibold text-center">
        <div className="mr-9" />
        <div className="w-1/2 text-center pr-2">Início</div>
        <div className="w-1/2 text-center">Fim</div>
      </div>

      {weekDays.map((day, index) => {
        const shift = editableShifts[day] ?? { shiftStart: '00:00', shiftEnd: '00:00', isBusy: true }
        const id = dayId(day)
        const checked = !shift.isBusy

        const handleChange = (field: 'shiftStart' | 'shiftEnd', value: string) => {
          setEditableShifts((prev) => ({
            ...prev,
            [day]: {
              ...(prev[day] ?? shift),
              [field]: value,
            },
          }))
        }

        return (
          <div key={index} className="flex items-center py-3">
            <div className="w-1/2 mr-5">
              <div className="relative h-5 w-5">
                <input
                  id={id}
                  type="checkbox"
                  className="peer absolute inset-0 h-5 w-5 opacity-0 cursor-pointer"
                  checked={checked}
                  onChange={(e) => toggleIsBusy(day, e.target.checked)}
                />
                <label
                  htmlFor={id}
                  className="
                    pointer-events-none absolute inset-0 flex items-center justify-center
                    rounded-full border-2 transition
                    border-[#A4978A]
                    peer-checked:border-[#A4978A]
                  "
                >
                  <CheckIcon className={`h-3.5 w-3.5 ${checked ? 'opacity-100' : 'opacity-0'} transition`} />
                </label>
              </div>
            </div>

            <div className="w-1/2 pr-2">
              <input
                type="time"
                className="bg-transparent w-full text-[#D9D9D9] focus:outline-none"
                value={shift.shiftStart || '00:00'}
                onChange={(e) => handleChange('shiftStart', e.target.value)}
                style={{ borderBottom: '1px solid #A4978A' }}
              />
            </div>

            <div className="w-1/2 pl-2">
              <input
                type="time"
                className="bg-transparent w-full text-[#D9D9D9] focus:outline-none"
                value={shift.shiftEnd || '00:00'}
                onChange={(e) => handleChange('shiftEnd', e.target.value)}
                style={{ borderBottom: '1px solid #A4978A' }}
              />
            </div>
          </div>
        )
      })}
    </>
  )
}

export default ShiftsRow
