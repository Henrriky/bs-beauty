export type NotificationDTO = {
  id: string
  marker: string
  title: string
  message: string
  createdAt: string
  type: NotificationType
  readAt: string | null
  appointmentId: string | null
}

export type PaginatedNotificationsResponse = {
  data: NotificationDTO[]
  total: number
  page: number
  totalPages: number
  limit: number
}

export type FindAllNotificationsParams = {
  page?: number
  limit?: number
}

enum NotificationType {
  APPOINTMENT = 'APPOINTMENT',
}

export interface MarkManyNotificationsRequest { ids: string[] }

export interface MarkManyAsReadResponse { updatedCount: number }

export interface DeleteNotificationsResponse { success: boolean; message: string }