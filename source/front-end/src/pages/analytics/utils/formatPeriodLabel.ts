export function formatPeriodLabel(period: string, groupBy: string): string {
  if (groupBy === 'day') {
    const date = new Date(period)
    return date.toLocaleDateString('pt-BR', {
      month: 'short',
      day: 'numeric',
    })
  }

  if (groupBy === 'week') {
    const [year, week] = period.split('-').map(Number)
    const firstDayOfYear = new Date(year, 0, 1)
    const daysOffset = (week - 1) * 7
    const firstDayOfWeek = new Date(firstDayOfYear)
    firstDayOfWeek.setDate(firstDayOfYear.getDate() + daysOffset)

    const dayOfWeek = firstDayOfWeek.getDay()
    const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek
    firstDayOfWeek.setDate(firstDayOfWeek.getDate() + diff)

    return firstDayOfWeek.toLocaleDateString('pt-BR', {
      month: 'short',
      day: 'numeric',
    })
  }

  const [year, month] = period.split('-')
  const date = new Date(Number.parseInt(year), Number.parseInt(month) - 1)
  return date.toLocaleDateString('pt-BR', {
    month: 'short',
    year: 'numeric',
  })
}
