import { addDays } from 'date-fns'

const WeekAppointments = () => {
  const today = new Date()
  const formatter = new Intl.DateTimeFormat('pt-br', { weekday: 'short' })

  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const date = addDays(today, i)
    return {
      date: date.toLocaleDateString().substring(0, 2),
      day: formatter.format(date).replace('.', '').toUpperCase(),
    }
  })

  return (
    <div className="flex justify-between mt-7">
      {weekDays.map((day) => (
        <div key={day.date} className="text-center flex flex-col gap-6 text-xs">
          <div className="text-secondary-700">{day.day}</div>
          <div className="text-primary-900">{day.date}</div>
        </div>
      ))}
    </div>
  )
}

export default WeekAppointments
