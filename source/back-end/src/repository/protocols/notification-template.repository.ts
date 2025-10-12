import { NotificationTemplateFilters } from '@/types/notification-templates/notification-template'
import { PaginatedRequest, PaginatedResult } from '@/types/pagination'
import type { NotificationTemplate, Prisma } from '@prisma/client'

interface NotificationTemplateRepository {
  findAll: (params: PaginatedRequest<NotificationTemplateFilters>) => Promise<PaginatedResult<NotificationTemplate>>
  findActiveByKey(key: string): Promise<NotificationTemplate | null>
  updateByKey(key: string, data: Prisma.NotificationTemplateUpdateInput): Promise<NotificationTemplate>
}

export type { NotificationTemplateRepository }
