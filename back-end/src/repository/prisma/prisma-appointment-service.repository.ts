import { type Prisma } from '@prisma/client'
import { prismaClient } from '../../lib/prisma'
import { type AppointmentServiceRepository } from '../protocols/appointment-service.repository'

class PrismaAppointmentServiceRepository implements AppointmentServiceRepository {
  public async findAll () {
    const appointmentServices = await prismaClient.appointmentService.findMany()

    return appointmentServices
  }

  public async findById (id: string) {
    const appointmentService = await prismaClient.appointmentService.findUnique({
      where: { id }
    })

    return appointmentService
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
      data: { ...otherFields, ...(appointmentDate instanceof Date && !isNaN(appointmentDate.getTime()) ? { appointmentDate } : {}) }
    })

    return updatedAppointmentService
  }

  public async delete (id: string) {
    const deletedAppointmentService = await prismaClient.appointmentService.delete({
      where: { id }
    })

    return deletedAppointmentService
  }
}

export { PrismaAppointmentServiceRepository }
