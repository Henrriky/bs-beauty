import type { Request } from 'express'

const formatDate = (req: Request) => {
  const birthdate: string = req.body.birthdate
  const birthdateFormatted = new Date(birthdate)

  return birthdateFormatted
}

export { formatDate }
