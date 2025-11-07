export interface NotificationTemplateSeedData {
  key: string
  name: string
  description: string
  title: string
  body: string
  isActive: boolean
  variables: string[]
}

export function generateNotificationTemplatesData(): NotificationTemplateSeedData[] {
  const templates: NotificationTemplateSeedData[] = []

  templates.push({
    key: 'BIRTHDAY',
    name: 'Mensagem de aniversário',
    description: 'Modelo de mensagem automática usado para parabenizar aniversariantes do dia.',
    title: 'Feliz aniversário, {nome}! 🎉',
    body: 'Oi, {nome}! Hoje você completa {idade} anos. A {empresa} te deseja um dia incrível!',
    isActive: true,
    variables: ['nome', 'idade', 'empresa', 'data_aniversário']
  })

  return templates
}
