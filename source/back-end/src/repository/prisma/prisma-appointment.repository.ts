import { type Prisma } from '@prisma/client'
import { prismaClient } from '../../lib/prisma'
import { type AppointmentRepository } from '../protocols/appointment.repository'

class PrismaAppointmentRepository implements AppointmentRepository {
  public async findAll() {
    const appointments = await prismaClient.appointment.findMany()

    return appointments
  }

  public async findById(id: string) {
    const appointment = await prismaClient.appointment.findUnique({
      where: { id },
      select: {
        id: true,
        observation: true,
        status: true,
        appointmentDate: true,
        appointment: {
          select: {
            customerId: true
          }
        },
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

    return appointment
  }

  public async findByCustomerOrEmployeeId(customerOrEmployeeId: string) {
    const appointments = await prismaClient.appointment.findMany({
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
        appointment: {
          select: {
            customerId: true
          }
        },
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

  public async findByAppointmentDate(appointmentDate: Date) {
    const appointments = await prismaClient.appointment.findMany({
      where: { appointmentDate }
    })

    return appointments
  }

  public async findByServiceOfferedId(serviceOfferedId: string) {
    const appointments = await prismaClient.appointment.findMany({
      where: { serviceOfferedId }
    })

    return appointments
  }

  public async create(appointmentToCreate: Prisma.AppointmentCreateInput) {
    const newAppointment = await prismaClient.appointment.create({
      data: { ...appointmentToCreate }
    })

    return newAppointment
  }

  public async update(id: string, appointmentToUpdate: Prisma.AppointmentUpdateInput) {
    const updatedAppointment = await prismaClient.appointment.update({
      where: { id },
      data: { ...appointmentToUpdate }
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
