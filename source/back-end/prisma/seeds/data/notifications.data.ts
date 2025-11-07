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

export function generateNotificationsData(appointments: Array<{
  id: string
  status: string
  appointmentDate: Date
  customerId: string
  professionalId: string
  customerName: string
  professionalName: string
  serviceName: string
}>): NotificationSeedData[] {
  const notifications: NotificationSeedData[] = []

  for (const appointment of appointments) {
    const appointmentDateStr = new Date(appointment.appointmentDate).toLocaleDateString('pt-BR')

    notifications.push({
      marker: `appointment:${appointment.id}:created:recipient:${appointment.professionalId}`,
      title: `Agendamento Criado | ${appointmentDateStr}`,
      message: `Novo atendimento de ${appointment.serviceName} para ${appointment.customerName} em ${appointmentDateStr}.`,
      type: 'APPOINTMENT',
      recipientId: appointment.professionalId,
      recipientType: 'PROFESSIONAL',
      readAt: ['CONFIRMED', 'CANCELLED', 'FINISHED'].includes(appointment.status) ? new Date(appointment.appointmentDate.getTime() - 1000 * 60 * 60) : null,
      appointmentId: appointment.id
    })

    if (appointment.status === 'CONFIRMED' || appointment.status === 'FINISHED') {
      notifications.push({
        marker: `appointment:${appointment.id}:confirmed:recipient:${appointment.customerId}`,
        title: `Agendamento Confirmado | ${appointmentDateStr}`,
        message: `Seu agendamento de ${appointment.serviceName} com ${appointment.professionalName} foi confirmado para ${appointmentDateStr}.`,
        type: 'APPOINTMENT',
        recipientId: appointment.customerId,
        recipientType: 'CUSTOMER',
        readAt: appointment.status === 'FINISHED' ? new Date(appointment.appointmentDate.getTime() - 1000 * 60 * 30) : null,
        appointmentId: appointment.id
      })
    }

    if (appointment.status === 'CANCELLED') {
      notifications.push({
        marker: `appointment:${appointment.id}:cancelled:recipient:${appointment.customerId}`,
        title: `Agendamento Cancelado | ${appointmentDateStr}`,
        message: `Seu agendamento de ${appointment.serviceName} com ${appointment.professionalName} foi cancelado (data original: ${appointmentDateStr}).`,
        type: 'APPOINTMENT',
        recipientId: appointment.customerId,
        recipientType: 'CUSTOMER',
        readAt: null,
        appointmentId: appointment.id
      })

      notifications.push({
        marker: `appointment:${appointment.id}:cancelled:recipient:${appointment.professionalId}`,
        title: `Agendamento Cancelado | ${appointmentDateStr}`,
        message: `O agendamento de ${appointment.serviceName} com ${appointment.customerName} foi cancelado (data original: ${appointmentDateStr}).`,
        type: 'APPOINTMENT',
        recipientId: appointment.professionalId,
        recipientType: 'PROFESSIONAL',
        readAt: null,
        appointmentId: appointment.id
      })
    }

    if (appointment.status === 'FINISHED') {
      notifications.push({
        marker: `appointment:${appointment.id}:finished:recipient:${appointment.customerId}`,
        title: `Agendamento Finalizado | ${appointmentDateStr}`,
        message: `Seu atendimento de ${appointment.serviceName} com ${appointment.professionalName} foi concluído. Que tal avaliar o serviço?`,
        type: 'APPOINTMENT',
        recipientId: appointment.customerId,
        recipientType: 'CUSTOMER',
        readAt: null,
        appointmentId: appointment.id
      })
    }
  }

  return notifications
}
