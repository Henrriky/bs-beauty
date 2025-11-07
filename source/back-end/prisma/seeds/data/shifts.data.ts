export interface ShiftSeedData {
  weekDay: 'SUNDAY' | 'MONDAY' | 'TUESDAY' | 'WEDNESDAY' | 'THURSDAY' | 'FRIDAY' | 'SATURDAY'
  isBusy: boolean
  shiftStart: Date
  shiftEnd: Date
  professionalName: string
}

export function generateShiftsData(): ShiftSeedData[] {
  const shifts: ShiftSeedData[] = []

  const professionals = [
    'Alyson Fumagalli',
    'Eliel da Silva',
    'Henrique Santiago Pires',
    'Henrriky Jhonny'
  ]

  const weekDays: Array<'MONDAY' | 'TUESDAY' | 'WEDNESDAY' | 'THURSDAY' | 'FRIDAY' | 'SATURDAY'> = [
    'MONDAY',
    'TUESDAY',
    'WEDNESDAY',
    'THURSDAY',
    'FRIDAY',
    'SATURDAY'
  ]

  for (const professionalName of professionals) {
    for (const weekDay of weekDays) {
      shifts.push({
        weekDay,
        isBusy: false,
        shiftStart: new Date('2024-01-01T12:00:00.000Z'),
        shiftEnd: new Date('2024-01-01T15:00:00.000Z'),
        professionalName
      })

      shifts.push({
        weekDay,
        isBusy: false,
        shiftStart: new Date('2024-01-01T17:00:00.000Z'),
        shiftEnd: new Date('2024-01-01T21:00:00.000Z'),
        professionalName
      })
    }
  }

  return shifts
}
