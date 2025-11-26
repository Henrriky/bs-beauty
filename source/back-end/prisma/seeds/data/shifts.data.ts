export interface ShiftSeedData {
  weekDay: 'SUNDAY' | 'MONDAY' | 'TUESDAY' | 'WEDNESDAY' | 'THURSDAY' | 'FRIDAY' | 'SATURDAY'
  isBusy: boolean
  shiftStart: Date
  shiftEnd: Date
  professionalName: string
}

const PROFESSIONALS = [
  'Alyson Fumagalli',
  'Bruna Silva',
  'Bruno Fischer',
  'Eliel da Silva',
  'Henrique Santiago Pires',
  'Henrriky Jhonny',
  'Giovanna Camille',
  'Camila Rodrigues Lima',
  'Fernanda Almeida Souza'
] as const

const WEEK_DAYS: Array<'MONDAY' | 'TUESDAY' | 'WEDNESDAY' | 'THURSDAY' | 'FRIDAY' | 'SATURDAY'> = [
  'MONDAY',
  'TUESDAY',
  'WEDNESDAY',
  'THURSDAY',
  'FRIDAY',
  'SATURDAY'
]

const SHIFT_TIME = { start: '12:00:00', end: '21:00:00' } as const

function createShift(
  professionalName: string,
  weekDay: typeof WEEK_DAYS[number]
): ShiftSeedData {
  const [startHours] = SHIFT_TIME.start.split(':').map(Number)
  const [endHours] = SHIFT_TIME.end.split(':').map(Number)

  // If end hour is less than start hour, shift crosses midnight (use next day)
  const endDay = endHours < startHours ? 2 : 1

  return {
    weekDay,
    isBusy: false,
    shiftStart: new Date(`2024-01-01T${SHIFT_TIME.start}.000Z`),
    shiftEnd: new Date(`2024-01-0${endDay}T${SHIFT_TIME.end}.000Z`),
    professionalName
  }
}

export function generateShiftsData(): ShiftSeedData[] {
  return PROFESSIONALS.flatMap(professionalName =>
    WEEK_DAYS.map(weekDay =>
      createShift(professionalName, weekDay)
    )
  )
}
