import { TokenPayload } from '@/middlewares/auth/verify-jwt-token.middleware'
import { NotificationFilters } from '@/types/notifications/notification-filters'
import { PaginatedRequest, PaginatedResult } from '@/types/pagination'
import type { Notification, Prisma } from '@prisma/client'

interface NotificationRepository {
  findAll: (user: TokenPayload, params: PaginatedRequest<NotificationFilters>) => Promise<PaginatedResult<Notification>>
  findById: (notificationId: string) => Promise<Notification | null>
  create: (notificationToCreate: Prisma.NotificationCreateInput) => Promise<Notification>
  delete: (notificationId: string) => Promise<Notification>
  findByMarker: (marker: string) => Promise<Notification | null>
  markManyAsReadForUser: (ids: string[], userId: string) => Promise<number>
}

export type { NotificationRepository }
