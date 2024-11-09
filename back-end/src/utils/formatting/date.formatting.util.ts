import { type Request } from 'express'

class DateFormatter {
  public static formatBirthdate = (req: Request) => {
    const date = req.body.birthdate
    const formattedDate = new Date(date as string)
    formattedDate.setHours(formattedDate.getHours() - formattedDate.getTimezoneOffset() / 60)

    return formattedDate
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
    const [hours, minutes] = time.split(':').map(Number)
    const formattedTime = new Date()
    formattedTime.setHours(hours as number, minutes as number, 0, 0)
    formattedTime.setHours(formattedTime.getHours() - formattedTime.getTimezoneOffset() / 60)

    return formattedTime
  }
}

export { DateFormatter }
