export interface ShiftSeedData {
  weekDay: 'SUNDAY' | 'MONDAY' | 'TUESDAY' | 'WEDNESDAY' | 'THURSDAY' | 'FRIDAY' | 'SATURDAY'
  isBusy: boolean
  shiftStart: Date
  shiftEnd: Date
  professionalName: string
}

const PROFESSIONALS = [
  'Alyson Fumagalli',
  'Eliel da Silva',
  'Henrique Santiago Pires',
  'Henrriky Jhonny'
] as const

const WEEK_DAYS: Array<'MONDAY' | 'TUESDAY' | 'WEDNESDAY' | 'THURSDAY' | 'FRIDAY' | 'SATURDAY'> = [
  'MONDAY',
  'TUESDAY',
  'WEDNESDAY',
  'THURSDAY',
  'FRIDAY',
  'SATURDAY'
]

const SHIFT_TIMES = [
  { start: '12:00:00', end: '15:00:00' },
  { start: '17:00:00', end: '21:00:00' }
] as const

function createShift(
  professionalName: string,
  weekDay: typeof WEEK_DAYS[number],
  shiftTime: typeof SHIFT_TIMES[number]
): ShiftSeedData {
  return {
    weekDay,
    isBusy: false,
    shiftStart: new Date(`2024-01-01T${shiftTime.start}.000Z`),
    shiftEnd: new Date(`2024-01-01T${shiftTime.end}.000Z`),
    professionalName
  }
}

export function generateShiftsData(): ShiftSeedData[] {
  return PROFESSIONALS.flatMap(professionalName =>
    WEEK_DAYS.flatMap(weekDay =>
      SHIFT_TIMES.map(shiftTime =>
        createShift(professionalName, weekDay, shiftTime)
      )
    )
  )
}
