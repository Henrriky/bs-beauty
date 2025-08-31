import { addDays } from 'date-fns'
import { CalendarIcon } from '@heroicons/react/24/outline'
import { appointmentAPI } from '../../../store/appointment/appointment-api'
import { authAPI } from '../../../store/auth/auth-api'

function getDifferenceInDays(date1: Date, date2: Date) {
  const diffInMilliseconds = Math.abs(
    new Date(date2).getTime() - new Date(date1).getTime(),
  )
  return Math.ceil(diffInMilliseconds / (1000 * 60 * 60 * 24))
}

const WeekAppointments = () => {
  const { data: userData } = authAPI.useFetchUserInfoQuery()
  const id = userData?.user.id

  const {
    data,
    error,
    isLoading,
  } = appointmentAPI.useFetchProfessionalAppointmentsByAllOffersQuery(id!)

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div>Error fetching appointments</div>
  }

  if (!data) {
    return <div>No data could be provided</div>
  }

  const daysWithAppointments = Array(7).fill(false)

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const sevenDaysFromNow = new Date(today)
  sevenDaysFromNow.setDate(today.getDate() + 7)

  data.appointments.forEach((element) => {
    const currentdate = new Date(element.appointmentDate)
    if (currentdate >= today && currentdate < sevenDaysFromNow) {
      const currentDay = new Date(currentdate)
      currentDay.setHours(0, 0, 0, 0)
      const difference = getDifferenceInDays(currentDay, today)
      daysWithAppointments[difference] = true
    }
  })

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
      {weekDays.map((day, index) => (
        <div key={day.date} className="text-center flex flex-col gap-6 text-xs">
          <div className="text-secondary-700">{day.day}</div>
          {daysWithAppointments[index] ? (
            <div className="flex flex-col text-secondary-300">
              <CalendarIcon className="size-8 mt-[-10px] mb-[-20px]"></CalendarIcon>
              <div className="size-8 ">{day.date}</div>
            </div>
          ) : (
            <div className="flex flex-col">
              <div className="text-primary-900 size-8 ">{day.date}</div>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

export default WeekAppointments
