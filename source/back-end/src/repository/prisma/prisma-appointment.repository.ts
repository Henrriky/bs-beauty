import { type Prisma } from '@prisma/client'
import { prismaClient } from '../../lib/prisma'
import { appointmentNonFinishedStatus, type AppointmentRepository } from '../protocols/appointment.repository'
import { type FindNonFinishedByUserAndDay } from '../types/appointment-repository.types'

class PrismaAppointmentRepository implements AppointmentRepository {
  public async findAll () {
    const appointments = await prismaClient.appointment.findMany()

    return appointments
  }

  public async findById (id: string) {
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

  public async findByCustomerOrProfessionalId (customerOrProfessionalId: string) {
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

  public async findByServiceOfferedId (serviceOfferedId: string) {
    const appointments = await prismaClient.appointment.findMany({
      where: { serviceOfferedId }
    })

    return appointments
  }

  public async findByDateRange (startDate: Date, endDate: Date) {
    const appointments = await prismaClient.appointment.findMany({
      where: {
        appointmentDate: {
          gte: startDate,
          lte: endDate
        }
      }
    })

    return appointments
  }

  public async findNonFinishedByUserAndDay (userId: string, dayToFetchAvailableSchedulling: Date) {
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

  public async countCustomerAppointmentsPerDay (customerId: string, day: Date = new Date()): Promise<number> {
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

  public async create (appointmentToCreate: Prisma.AppointmentCreateInput) {
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

  public async update (id: string, appointmentToUpdate: Prisma.AppointmentUpdateInput) {
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

  public async delete (id: string) {
    const deletedAppointment = await prismaClient.appointment.delete({
      where: { id }
    })

    return deletedAppointment
  }
}

export { PrismaAppointmentRepository }
