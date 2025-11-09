export interface NotificationTemplateSeedData {
  key: string
  name: string
  description: string
  title: string
  body: string
  isActive: boolean
  variables: string[]
}

const BIRTHDAY_TEMPLATE: NotificationTemplateSeedData = {
  key: 'BIRTHDAY',
  name: 'Mensagem de aniversário',
  description: 'Modelo de mensagem automática usado para parabenizar aniversariantes do dia.',
  title: 'Feliz aniversário, {nome}! 🎉',
  body: 'Oi, {nome}! Hoje você completa {idade} anos. A {empresa} te deseja um dia incrível!',
  isActive: true,
  variables: ['nome', 'idade', 'empresa', 'data_aniversário']
}

export function generateNotificationTemplatesData(): NotificationTemplateSeedData[] {
  return [BIRTHDAY_TEMPLATE]
}
