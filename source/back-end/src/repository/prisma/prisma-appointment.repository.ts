import { type Prisma } from '@prisma/client'
import { prismaClient } from '../../lib/prisma'
import { type AppointmentRepository } from '../protocols/appointment.repository'

class PrismaAppointmentRepository implements AppointmentRepository {
  public async findAll () {
    const appointments = await prismaClient.appointment.findMany()

    return appointments
  }

  public async findById (id: string) {
    const appointment = await prismaClient.appointment.findUnique({
      where: { id }
    })

    return appointment
  }

  public async findByCustomerId (customerId: string) {
    const appointments = await prismaClient.appointment.findMany({
      where: { customerId }
    })

    return appointments
  }

  public async create (appointmentToCreate: Prisma.AppointmentCreateInput) {
    const newAppointment = await prismaClient.appointment.create({
      data: { ...appointmentToCreate }
    })

    return newAppointment
  }

  public async update (id: string, appointmentToUpdate: Prisma.AppointmentUpdateInput) {
    const updatedAppointment = await prismaClient.appointment.update({
      where: { id },
      data: { ...appointmentToUpdate }
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
