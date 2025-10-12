import { WeekDays } from '@prisma/client'
import { type Request } from 'express'
import { DateTime } from 'luxon'

class DateFormatter {
  public static formatBirthdate = (req: Request) => {
    const date = req.body.birthdate
    const formattedDate = new Date(date as string)
    formattedDate.setHours(formattedDate.getHours() - formattedDate.getTimezoneOffset() / 60)

    return formattedDate
  }

  public static formatBirthday(
    birthdate: Date | null | undefined,
    pattern = 'dd/LL'
  ): string {
    if (!birthdate) return ''
    const isoDate = DateTime.fromJSDate(birthdate, { zone: 'utc' }).toISODate()
    return DateTime.fromISO(isoDate!).toFormat(pattern)
  }

  public static formatAppointmentDate = (req: Request) => {
    const date = req.body.appointmentDate
    const formattedDate = new Date(date as string)
    formattedDate.setHours(formattedDate.getHours() - formattedDate.getTimezoneOffset() / 60)

    return formattedDate
  }

  public static formatShiftStart = (req: Request) => {
    const time = req.body.shiftStart
    if (typeof time === 'string') {
      const [hours, minutes] = time.split(':').map(Number)
      const formattedTime = new Date()
      formattedTime.setHours(hours, minutes, 0, 0)
      formattedTime.setHours(formattedTime.getHours() - formattedTime.getTimezoneOffset() / 60)

      return formattedTime
    }

    return new Date()
  }

  public static formatShiftEnd = (req: Request) => {
    const time = req.body.shiftEnd
    if (typeof time === 'string') {
      const [hours, minutes] = time.split(':').map(Number)
      const formattedTime = new Date()
      formattedTime.setHours(hours, minutes, 0, 0)
      formattedTime.setHours(formattedTime.getHours() - formattedTime.getTimezoneOffset() / 60)

      return formattedTime
    }

    return new Date()
  }

  public static formatDayOfDateToWeekDay = (date: Date): WeekDays => {
    const days: Record<number, WeekDays> = {
      0: WeekDays.SUNDAY,
      1: WeekDays.MONDAY,
      2: WeekDays.TUESDAY,
      3: WeekDays.WEDNESDAY,
      4: WeekDays.THURSDAY,
      5: WeekDays.FRIDAY,
      6: WeekDays.SATURDAY
    }

    return days[date.getDay()]
  }
}

export { DateFormatter }
