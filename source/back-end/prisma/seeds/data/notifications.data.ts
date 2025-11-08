export interface NotificationSeedData {
  marker: string
  title: string
  message: string
  type: 'APPOINTMENT' | 'SYSTEM'
  recipientId: string
  recipientType: 'CUSTOMER' | 'PROFESSIONAL'
  readAt: Date | null
  appointmentId: string
}

interface AppointmentData {
  id: string
  status: string
  appointmentDate: Date
  customerId: string
  professionalId: string
  customerName: string
  professionalName: string
  serviceName: string
}

function createNotification(
  marker: string,
  title: string,
  message: string,
  recipientId: string,
  recipientType: 'CUSTOMER' | 'PROFESSIONAL',
  appointmentId: string,
  readAt: Date | null = null
): NotificationSeedData {
  return {
    marker,
    title,
    message,
    type: 'APPOINTMENT',
    recipientId,
    recipientType,
    readAt,
    appointmentId
  }
}

function getReadAtTime(appointment: AppointmentData, statusesToCheck: string[], minutesOffset: number): Date | null {
  return statusesToCheck.includes(appointment.status)
    ? new Date(appointment.appointmentDate.getTime() - 1000 * 60 * minutesOffset)
    : null
}

function createAppointmentCreatedNotification(appointment: AppointmentData): NotificationSeedData {
  const dateStr = new Date(appointment.appointmentDate).toLocaleDateString('pt-BR')

  return createNotification(
    `appointment:${appointment.id}:created:recipient:${appointment.professionalId}`,
    `Agendamento Criado | ${dateStr}`,
    `Novo atendimento de ${appointment.serviceName} para ${appointment.customerName} em ${dateStr}.`,
    appointment.professionalId,
    'PROFESSIONAL',
    appointment.id,
    getReadAtTime(appointment, ['CONFIRMED', 'CANCELLED', 'FINISHED'], 60)
  )
}

function createAppointmentConfirmedNotification(appointment: AppointmentData): NotificationSeedData | null {
  if (!['CONFIRMED', 'FINISHED'].includes(appointment.status)) return null

  const dateStr = new Date(appointment.appointmentDate).toLocaleDateString('pt-BR')

  return createNotification(
    `appointment:${appointment.id}:confirmed:recipient:${appointment.customerId}`,
    `Agendamento Confirmado | ${dateStr}`,
    `Seu agendamento de ${appointment.serviceName} com ${appointment.professionalName} foi confirmado para ${dateStr}.`,
    appointment.customerId,
    'CUSTOMER',
    appointment.id,
    getReadAtTime(appointment, ['FINISHED'], 30)
  )
}

function createAppointmentCancelledNotifications(appointment: AppointmentData): NotificationSeedData[] {
  if (appointment.status !== 'CANCELLED') return []

  const dateStr = new Date(appointment.appointmentDate).toLocaleDateString('pt-BR')
  const cancelMessage = `foi cancelado (data original: ${dateStr}).`

  return [
    createNotification(
      `appointment:${appointment.id}:cancelled:recipient:${appointment.customerId}`,
      `Agendamento Cancelado | ${dateStr}`,
      `Seu agendamento de ${appointment.serviceName} com ${appointment.professionalName} ${cancelMessage}`,
      appointment.customerId,
      'CUSTOMER',
      appointment.id
    ),
    createNotification(
      `appointment:${appointment.id}:cancelled:recipient:${appointment.professionalId}`,
      `Agendamento Cancelado | ${dateStr}`,
      `O agendamento de ${appointment.serviceName} com ${appointment.customerName} ${cancelMessage}`,
      appointment.professionalId,
      'PROFESSIONAL',
      appointment.id
    )
  ]
}

function createAppointmentFinishedNotification(appointment: AppointmentData): NotificationSeedData | null {
  if (appointment.status !== 'FINISHED') return null

  const dateStr = new Date(appointment.appointmentDate).toLocaleDateString('pt-BR')

  return createNotification(
    `appointment:${appointment.id}:finished:recipient:${appointment.customerId}`,
    `Agendamento Finalizado | ${dateStr}`,
    `Seu atendimento de ${appointment.serviceName} com ${appointment.professionalName} foi concluído. Que tal avaliar o serviço?`,
    appointment.customerId,
    'CUSTOMER',
    appointment.id
  )
}

export function generateNotificationsData(appointments: AppointmentData[]): NotificationSeedData[] {
  return appointments.flatMap(appointment => {
    const notifications: NotificationSeedData[] = []

    notifications.push(createAppointmentCreatedNotification(appointment))

    const confirmedNotif = createAppointmentConfirmedNotification(appointment)
    if (confirmedNotif) notifications.push(confirmedNotif)

    notifications.push(...createAppointmentCancelledNotifications(appointment))

    const finishedNotif = createAppointmentFinishedNotification(appointment)
    if (finishedNotif) notifications.push(finishedNotif)

    return notifications
  })
}
