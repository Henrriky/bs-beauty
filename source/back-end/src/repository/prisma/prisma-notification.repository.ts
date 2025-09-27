import { TokenPayload } from '@/middlewares/auth/verify-jwt-token.middleware'
import { NotificationFilters } from '@/types/notifications/notification-filters'
import { PaginatedRequest } from '@/types/pagination'
import { type Prisma } from '@prisma/client'
import { prismaClient } from '../../lib/prisma'
import { type NotificationRepository } from '../protocols/notification.repository'

class PrismaNotificationRepository implements NotificationRepository {

  public async findAll(
    user: TokenPayload,
    params: PaginatedRequest<NotificationFilters>
  ) {
    const { page, limit, filters } = params
    const skip = (page - 1) * limit

    const andWhere: Prisma.NotificationWhereInput[] = [
      { recipientId: user.id }
    ]

    if (filters?.readStatus === 'READ') {
      andWhere.push({ NOT: { readAt: null } })
    } else if (filters?.readStatus === 'UNREAD') {
      andWhere.push({ readAt: null })
    }

    const where: Prisma.NotificationWhereInput = { AND: andWhere }

    const [data, total] = await Promise.all([
      prismaClient.notification.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' }
      }),
      prismaClient.notification.count({ where })
    ])

    return {
      data,
      total,
      page,
      totalPages: Math.ceil(total / limit),
      limit
    }
  }

  public async findById (id: string) {
    const notification = await prismaClient.notification.findUnique({
      where: { id }
    })

    return notification
  }

  public async create (notificationToCreate: Prisma.NotificationCreateInput) {
    const newNotification = await prismaClient.notification.create({
      data: { ...notificationToCreate }
    })

    return newNotification
  }

  public async delete (id: string) {
    const deletedNotification = await prismaClient.notification.delete({
      where: { id }
    })

    return deletedNotification
  }

  public async findFirstByAppointmentAndMarker(appointmentId: string, marker: string) {
    return await prismaClient.notification.findFirst({
      where: { appointmentId, message: { contains: marker } }
    })
  }

  public async findByMarker(marker: string) {
    return await prismaClient.notification.findUnique({ where: { marker } })
  }

  public async markManyAsReadForUser(ids: string[], userId: string) {
    const result = await prismaClient.notification.updateMany({
      where: {
        id: { in: ids },
        recipientId: userId,
        readAt: null
      },
      data: { readAt: new Date() }
    })
    return result.count
  }

}

export { PrismaNotificationRepository }
