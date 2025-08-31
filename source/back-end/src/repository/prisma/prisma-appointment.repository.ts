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
        }
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
        }
      }
    })

    return appointments
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
