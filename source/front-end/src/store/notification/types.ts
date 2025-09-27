export type NotificationDTO = {
  id: string
  message: string
  createdAt: string
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

export interface MarkManyAsReadRequest { ids: string[] }

export interface MarkManyAsReadResponse { updatedCount: number }