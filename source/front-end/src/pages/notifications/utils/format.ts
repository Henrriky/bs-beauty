export function formatPtBrWithAs(input: Date | string | undefined | null) {
  if (!input) return undefined
  const d = input instanceof Date ? input : new Date(input)
  if (isNaN(d.getTime())) return undefined
  const date = d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })
  const time = d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', hour12: false })
  return `${date} às ${time}`
}

export function parseMarker(message: string) {
  const inside = message.match(/\[([^\]]+)\]/)?.[1] ?? ''
  const parts = inside.split(' - ').map(s => s.trim())
  const baseTitle = parts[0] || 'Notificação'
  const maybeISO = parts.at(-1)
  const when = formatPtBrWithAs(maybeISO)
  return { baseTitle, when } as const
}

export function buildTitle(message: string) {
  const { baseTitle } = parseMarker(message)
  return baseTitle
}

export function buildDate(message: string) {
  const { when } = parseMarker(message)
  return when
}

export function buildTitleWithDate(message: string) {
  const { baseTitle, when } = parseMarker(message)
  return when ? `${baseTitle} - ${when}` : baseTitle
}

export function buildCompactTitle(message: string) {
  const { baseTitle, when } = parseMarker(message)
  if (!when) return baseTitle

  const compact = when.replace(/(\d{2}\/\d{2})\/\d{4}/, '$1')
  return `${baseTitle} - ${compact}`
}