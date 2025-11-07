import { Appointment, Status, type Prisma } from '@prisma/client'
import { prismaClient } from '../../lib/prisma'
import { appointmentNonFinishedStatus, type AppointmentRepository, type GroupedAppointmentCount, type GroupedEstimatedTime, type GroupingPeriod } from '../protocols/appointment.repository'
import { type FindNonFinishedByUserAndDay } from '../types/appointment-repository.types'
import { PaginatedRequest, PaginatedResult } from '@/types/pagination'
import { AppointmentFilters } from '@/types/appointments/appointment-filters'

class PrismaAppointmentRepository implements AppointmentRepository {
  public async findAll() {
    const appointments = await prismaClient.appointment.findMany()

    return appointments
  }

  public async findAllPaginated(
    params: PaginatedRequest<AppointmentFilters>,
    scope: { userId: string; viewAll: boolean }
  ): Promise<PaginatedResult<Appointment>> {
    const { page, limit, filters } = params

    const scopeWhere: Prisma.AppointmentWhereInput | undefined = scope.viewAll
      ? undefined
      : {
        OR: [
          { customerId: scope.userId },
          { offer: { professionalId: scope.userId } }
        ]
      }

    const filtersWhere: Prisma.AppointmentWhereInput = {
      ...(filters?.status?.length ? { status: { in: filters.status } } : {}),
      ...(filters?.from || filters?.to ? {
        appointmentDate: {
          ...(filters.from ? { gte: filters.from } : {}),
          ...(filters.to ? { lte: filters.to } : {})
        }
      } : {})
    }

    const where: Prisma.AppointmentWhereInput =
      scopeWhere ? { AND: [scopeWhere, filtersWhere] } : filtersWhere

    const [appointments, total] = await prismaClient.$transaction([
      prismaClient.appointment.findMany({
        include: {
          offer: {
            select: {
              id: true,
              service: {
                select: {
                  id: true,
                  name: true,
                  description: true
                }
              },
              price: true,
              isOffering: true,
              estimatedTime: true,
              professional: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                  profilePhotoUrl: true
                }
              }
            },
          },
          customer: {
            select: {
              id: true,
              name: true,
              email: true,
              profilePhotoUrl: true
            }
          },
          rating: true
        },
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { appointmentDate: 'asc' }
      }),
      prismaClient.appointment.count({ where })
    ])

    return { data: appointments, total, page, limit, totalPages: Math.ceil(total / limit) }
  }

  public async findById(id: string) {
    const appointment = await prismaClient.appointment.findUnique({
      where: { id },
      select: {
        id: true,
        observation: true,
        status: true,
        appointmentDate: true,
        allowImageUse: true,
        customerId: true,
        serviceOfferedId: true,
        createdAt: true,
        updatedAt: true,
        offer: {
          select: {
            id: true,
            estimatedTime: true,
            price: true,
            professionalId: true,
            service: {
              select: {
                name: true
              }
            },
            professional: true
          }
        },
        customer: true,
        rating: true
      }
    })

    return appointment
  }

  public async findByCustomerOrProfessionalId(customerOrProfessionalId: string) {
    const appointments = await prismaClient.appointment.findMany({
      where: {
        OR: [
          {
            customerId: customerOrProfessionalId
          },
          {
            offer: {
              professionalId: customerOrProfessionalId
            }
          }
        ]
      },
      select: {
        id: true,
        observation: true,
        status: true,
        appointmentDate: true,
        customerId: true,
        serviceOfferedId: true,
        allowImageUse: true,
        createdAt: true,
        updatedAt: true,
        offer: {
          select: {
            id: true,
            estimatedTime: true,
            professionalId: true,
            service: {
              select: {
                name: true
              }
            },
            professional: true
          }
        },
        rating: true // TODO: select only used attributes
      }
    })

    return appointments
  }

  public async findByServiceOfferedId(serviceOfferedId: string) {
    const appointments = await prismaClient.appointment.findMany({
      where: { serviceOfferedId }
    })

    return appointments
  }

  public async findByDateRangeStatusProfessionalAndServices(startDate: Date, endDate: Date, statusList?: Status[], professionalId?: string, serviceIds?: string[]) {
    const where: Prisma.AppointmentWhereInput = {
      appointmentDate: {
        gte: startDate,
        lte: endDate
      }
    }

    if (statusList && statusList.length > 0) {
      where.status = { in: statusList }
    }

    const offerWhere: Prisma.OfferWhereInput = {}

    if (professionalId) {
      offerWhere.professionalId = professionalId
    }

    if (serviceIds?.length) {
      offerWhere.serviceId = { in: serviceIds }
    }

    if (professionalId || serviceIds?.length) {
      where.offer = { is: offerWhere }
    }

    const appointments = await prismaClient.appointment.findMany({
      where
    })

    return appointments
  }

  public async countByDateRangeGrouped(
    startDate: Date,
    endDate: Date,
    groupBy: GroupingPeriod,
    statusList?: Status[],
    professionalId?: string,
    serviceIds?: string[]
  ): Promise<GroupedAppointmentCount[]> {
    let dateFormat;

    if (groupBy === 'day') {
      dateFormat = '%Y-%m-%d';
    } else if (groupBy === 'week') {
      dateFormat = '%Y-%u';
    } else {
      dateFormat = '%Y-%m';
    }

    let query = `
      SELECT 
        DATE_FORMAT(a.appointment_date, '${dateFormat}') as period,
        COUNT(*) as count
      FROM appointment a
    `

    const conditions: string[] = []
    const params: any[] = []

    if (professionalId || (serviceIds && serviceIds.length > 0)) {
      query += ' INNER JOIN offer o ON a.service_id = o.id'
    }

    conditions.push('a.appointment_date >= ?')
    params.push(startDate)
    conditions.push('a.appointment_date <= ?')
    params.push(endDate)

    if (statusList && statusList.length > 0) {
      const placeholders = statusList.map(() => '?').join(',')
      conditions.push(`a.status IN (${placeholders})`)
      params.push(...statusList)
    }

    if (professionalId) {
      conditions.push('o.professional_id = ?')
      params.push(professionalId)
    }

    if (serviceIds && serviceIds.length > 0) {
      const placeholders = serviceIds.map(() => '?').join(',')
      conditions.push(`o.service_id IN (${placeholders})`)
      params.push(...serviceIds)
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ')
    }

    query += ' GROUP BY period ORDER BY period ASC'

    const result = await prismaClient.$queryRawUnsafe<Array<{ period: string, count: bigint }>>(
      query,
      ...params
    )

    return result.map(row => ({
      period: row.period,
      count: Number(row.count)
    }))
  }

  public async sumEstimatedTimeByDateRangeGrouped(
    startDate: Date,
    endDate: Date,
    groupBy: GroupingPeriod,
    statusList?: Status[],
    professionalId?: string,
    serviceIds?: string[]
  ): Promise<GroupedEstimatedTime[]> {
    let dateFormat;

    if (groupBy === 'day') {
      dateFormat = '%Y-%m-%d';
    } else if (groupBy === 'week') {
      dateFormat = '%Y-%u';
    } else {
      dateFormat = '%Y-%m';
    }

    let query = `
      SELECT 
        DATE_FORMAT(a.appointment_date, '${dateFormat}') as period,
        SUM(o.estimated_time) as estimatedTimeInMinutes
      FROM appointment a
      INNER JOIN offer o ON a.service_id = o.id
    `

    const conditions: string[] = []
    const params: any[] = []

    conditions.push('a.appointment_date >= ?')
    params.push(startDate)
    conditions.push('a.appointment_date <= ?')
    params.push(endDate)

    if (statusList && statusList.length > 0) {
      const placeholders = statusList.map(() => '?').join(',')
      conditions.push(`a.status IN (${placeholders})`)
      params.push(...statusList)
    }

    if (professionalId) {
      conditions.push('o.professional_id = ?')
      params.push(professionalId)
    }

    if (serviceIds && serviceIds.length > 0) {
      const placeholders = serviceIds.map(() => '?').join(',')
      conditions.push(`o.service_id IN (${placeholders})`)
      params.push(...serviceIds)
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ')
    }

    query += ' GROUP BY period ORDER BY period ASC'

    const result = await prismaClient.$queryRawUnsafe<Array<{ period: string, estimatedTimeInMinutes: number | null }>>(
      query,
      ...params
    )

    return result.map(row => ({
      period: row.period,
      estimatedTimeInMinutes: row.estimatedTimeInMinutes ? Number(row.estimatedTimeInMinutes) : 0
    }))
  }

  public async findNonFinishedByUserAndDay(userId: string, dayToFetchAvailableSchedulling: Date) {
    const startOfDay = new Date(dayToFetchAvailableSchedulling)
    startOfDay.setHours(0, 0, 0, 0)

    const endOfDay = new Date(dayToFetchAvailableSchedulling)
    endOfDay.setHours(23, 59, 59, 999)

    const nonFinishedAppointmentsByUserOnDay = await prismaClient
      .appointment
      .findMany({
        where: {
          AND: [
            {
              OR: [
                {
                  customerId: userId
                },
                {
                  offer: {
                    professionalId: userId
                  }
                }
              ]
            },
            {
              appointmentDate: {
                gte: startOfDay,
                lte: endOfDay
              }
            },
            {
              status: {
                in: appointmentNonFinishedStatus
              }
            }
          ]
        },
        select: {
          offer: true,
          id: true,
          observation: true,
          status: true,
          appointmentDate: true
        }
      })

    return {
      validAppointmentsOnDay: nonFinishedAppointmentsByUserOnDay.map(appointment => ({
        id: appointment.id,
        observation: appointment.observation,
        status: appointment.status,
        appointmentDate: appointment.appointmentDate,
        appointmentId: appointment.id,
        estimatedTime: appointment.offer.estimatedTime
      }) satisfies FindNonFinishedByUserAndDay[0])
    }
  }

  public async countCustomerAppointmentsPerDay(customerId: string, day: Date = new Date()): Promise<number> {
    const startOfDay = new Date(day)
    startOfDay.setHours(0, 0, 0, 0)
    const endOfDay = new Date(day)
    endOfDay.setHours(23, 59, 59, 59)

    return await prismaClient.appointment.count({
      where: {
        customerId,
        createdAt: {
          gte: startOfDay,
          lte: endOfDay
        }
      }
    })
  }

  public async create(appointmentToCreate: Prisma.AppointmentCreateInput) {
    const newAppointment = await prismaClient.appointment.create({
      data: { ...appointmentToCreate },
      include: {
        offer: {
          select: {
            id: true,
            estimatedTime: true,
            price: true,
            professionalId: true,
            service: { select: { name: true } },
            professional: true
          }
        },
        customer: true
      }
    })

    return newAppointment
  }

  public async update(id: string, appointmentToUpdate: Prisma.AppointmentUpdateInput) {
    const updatedAppointment = await prismaClient.appointment.update({
      where: { id },
      data: { ...appointmentToUpdate },
      include: {
        offer: {
          select: {
            id: true,
            estimatedTime: true,
            price: true,
            professionalId: true,
            service: { select: { name: true } },
            professional: true
          }
        },
        customer: true
      }
    })

    return updatedAppointment
  }

  public async delete(id: string) {
    const deletedAppointment = await prismaClient.appointment.delete({
      where: { id }
    })

    return deletedAppointment
  }
}

export { PrismaAppointmentRepository }
