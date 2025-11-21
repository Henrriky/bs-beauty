import { useMemo } from 'react'

export function useDateRange() {
  const defaultDates = useMemo(() => {
    const today = new Date()

    const start = new Date(today.getFullYear(), today.getMonth(), 1)
    const end = new Date(today.getFullYear(), today.getMonth() + 1, 0)

    const formatDate = (date: Date) => {
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      return `${year}-${month}-${day}`
    }

    return {
      startDate: formatDate(start),
      endDate: formatDate(end),
    }
  }, [])

  const toISO = (date: string, isEnd = false) => {
    if (!date) return ''
    return isEnd ? `${date}T23:59:59.999Z` : `${date}T00:00:00.000Z`
  }

  return { defaultDates, toISO }
}
