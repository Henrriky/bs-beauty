interface DaysRowProps {
  weekDays: string[]
  editableShifts: {
    [day: string]: {
      isBusy: boolean
      shiftStart: string
      shiftEnd: string
    }
  }
}

const DaysRow = ({ weekDays, editableShifts }: DaysRowProps) => {
  return (
    <>
      <div className="font-semibold pb-4">Dia</div>
      {weekDays.map((day, index) => {
        const isBusy = editableShifts[day]?.isBusy ?? true
        return (
          <div
            key={index}
            className={`pb-7 ${isBusy ? 'text-primary-200' : 'text-[#D9D9D9]'}`}
            style={{ paddingBottom: '1.65rem' }}
          >
            {day}
          </div>
        )
      })}
    </>
  )
}

export default DaysRow
