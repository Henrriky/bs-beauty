import { type Prisma } from '@prisma/client'
import { prismaClient } from '../../lib/prisma'
import { type AppointmentServiceRepository } from '../protocols/appointment-service.repository'

class PrismaAppointmentServiceRepository implements AppointmentServiceRepository {
  public async findAll () {
    const appointmentServices = await prismaClient.appointmentService.findMany()

    return appointmentServices
  }

  public async findById (id: string) {
    const appointmentServices = await prismaClient.appointmentService.findUnique({
      where: { id },
      select: {
        id: true,
        status: true,
        observation: true,
        appointmentDate: true,
        serviceOffered: {
          select: {
            id: true,
            estimatedTime: true,
            employee: true,
            price: true,
            service: {
              select: {
                name: true
              }
            }
          }
        },
      }
    })

    return appointmentServices
  }

  public async findByAppointmentDate (appointmentDate: Date) {
    const appointmentServices = await prismaClient.appointmentService.findMany({
      where: { appointmentDate }
    })

    return appointmentServices
  }

  public async findByAppointmentId (appointmentId: string) {
    const appointmentServices = await prismaClient.appointmentService.findMany({
      where: { appointmentId }
    })

    return appointmentServices
  }

  public async findByServiceOfferedId (serviceOfferedId: string) {
    const appointmentServices = await prismaClient.appointmentService.findMany({
      where: { serviceOfferedId }
    })

    return appointmentServices
  }

  public async create (appointmentServiceToCreate: Prisma.AppointmentServiceCreateInput) {
    const newAppointmentService = await prismaClient.appointmentService.create({
      data: { ...appointmentServiceToCreate }
    })

    return newAppointmentService
  }

  public async update (id: string, appointmentServiceToUpdate: Prisma.AppointmentServiceUpdateInput) {
    const { appointmentDate, ...otherFields } = appointmentServiceToUpdate
    const updatedAppointmentService = await prismaClient.appointmentService.update({
      where: { id },
      data: { ...otherFields, ...(appointmentDate instanceof Date && !isNaN(appointmentDate.getTime()) ? { appointmentDate } : {}),
      appointment: {
        update: {
          status: otherFields.status
        }
      }
    }
    })

    return updatedAppointmentService
  }

  public async delete (id: string) {
    const deletedAppointmentService = await prismaClient.appointmentService.delete({
      where: { id }
    })

    return deletedAppointmentService
  }

  public async findByCustomerOrEmployeeId (customerOrEmployeeId: string) {
    const appointments = await prismaClient.appointmentService.findMany({
      where: {
        OR: [
          {
            appointment: {
              customerId: customerOrEmployeeId
            }
          },
          {
            serviceOffered: {
              employeeId: customerOrEmployeeId
            }
          }
        ]
      },
      select: {
        id: true,
        status: true,
        observation: true,
        serviceOffered: {
          select: {
            id: true,
            estimatedTime: true,
            employee: true,
            service: {
              select: {
                name: true
              }
            }
          }
        },
        appointmentDate: true
      }
    })

    return { appointments }
  }
}

export { PrismaAppointmentServiceRepository }
