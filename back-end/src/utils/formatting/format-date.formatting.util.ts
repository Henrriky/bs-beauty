import type { Request } from 'express'

const formatDate = (req: Request) => {
  let date: string = ''
  if (req.body.birthdate != null) {
    date = req.body.birthdate
  }
  if (req.body.appointmentDate != null) {
    date = req.body.appointmentDate
  }
  const formattedDate = new Date(date)
  formattedDate.setHours(formattedDate.getHours() - formattedDate.getTimezoneOffset() / 60)

  return formattedDate
}

export { formatDate }
