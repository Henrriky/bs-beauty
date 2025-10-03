import { NotificationTemplate, type Prisma } from '@prisma/client'
import { prismaClient } from '../../lib/prisma'
import { NotificationTemplateRepository } from '../protocols/notification-template.repository'
import { PaginatedRequest, PaginatedResult } from '@/types/pagination';
import { NotificationTemplateFilters } from '@/types/notification-templates/notification-template';

class PrismaNotificationTemplateRepository implements NotificationTemplateRepository {

  public async findAll(params: PaginatedRequest<NotificationTemplateFilters>): Promise<PaginatedResult<NotificationTemplate>> {
    const { page, limit, filters } = params

    const skip = (page - 1) * limit

    const where = {
      key: ((filters?.key) != null) ? { contains: filters.key } : undefined,
      name: ((filters?.name) != null) ? { contains: filters.name } : undefined,
    }

    const [data, total] = await Promise.all([
      prismaClient.notificationTemplate.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'asc' }
      }),
      prismaClient.notificationTemplate.count({ where })
    ])

    return {
      data,
      total,
      page,
      totalPages: Math.ceil(total / limit),
      limit
    }
  }

  public async findActiveByKey(key: string): Promise<NotificationTemplate | null> {
    const normalizedKey = key.toUpperCase();

    const template = await prismaClient.notificationTemplate.findFirst({
      where: {
        key: normalizedKey,
        isActive: true,
      },
      orderBy: { updatedAt: 'desc' },
    });

    return template;
  }

  public async updateByKey(key: string, data: Prisma.NotificationTemplateUpdateInput): Promise<NotificationTemplate> {
    return prismaClient.notificationTemplate.update({
      where: { key },
      data
    })
  }

}

export { PrismaNotificationTemplateRepository }
