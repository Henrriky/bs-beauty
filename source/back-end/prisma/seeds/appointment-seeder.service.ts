import { PrismaClient } from '@prisma/client'
import { generateAppointmentsData } from './data/appointments.data'
import { BaseRelationSeederService } from './base-relation-seeder.service'

export class AppointmentSeederService extends BaseRelationSeederService {
  private readonly entityName = 'appointment'

  constructor(private readonly prismaClient: PrismaClient) {
    super()
  }

  async seedAppointments(): Promise<void> {
    this.logSeedingStart(this.entityName)

    const appointments = generateAppointmentsData()
    let createdCount = 0
    let skippedCount = 0

    for (const appointment of appointments) {
      const customer = await this.prismaClient.customer.findUnique({
        where: { email: appointment.customerEmail }
      })

      if (!customer) {
        this.logWarning(this.entityName, `Customer not found: ${appointment.customerEmail}`)
        skippedCount++
        continue
      }

      const professional = await this.prismaClient.professional.findFirst({
        where: { name: appointment.professionalName }
      })

      if (!professional) {
        this.logWarning(this.entityName, `Professional not found: ${appointment.professionalName}`)
        skippedCount++
        continue
      }

      const service = await this.prismaClient.service.findFirst({
        where: { name: appointment.serviceName }
      })

      if (!service) {
        this.logWarning(this.entityName, `Service not found: ${appointment.serviceName}`)
        skippedCount++
        continue
      }

      const offer = await this.prismaClient.offer.findFirst({
        where: {
          professionalId: professional.id,
          serviceId: service.id
        }
      })

      if (!offer) {
        this.logWarning(
          this.entityName,
          `Offer not found for professional "${appointment.professionalName}" and service "${appointment.serviceName}"`
        )
        skippedCount++
        continue
      }

      const existingAppointment = await this.prismaClient.appointment.findFirst({
        where: {
          customerId: customer.id,
          serviceOfferedId: offer.id,
          appointmentDate: appointment.appointmentDate
        }
      })

      if (existingAppointment) {
        this.logInfo(
          this.entityName,
          `Appointment already exists for customer ${customer.email} on ${appointment.appointmentDate.toISOString()}`
        )
        skippedCount++
        continue
      }

      await this.prismaClient.appointment.create({
        data: {
          observation: appointment.observation,
          status: appointment.status,
          appointmentDate: appointment.appointmentDate,
          allowImageUse: appointment.allowImageUse,
          customerId: customer.id,
          serviceOfferedId: offer.id
        }
      })

      createdCount++
    }

    this.logSeedingComplete(this.entityName, { createdCount, skippedCount })
  }

  async verifyAppointments(): Promise<void> {
    this.logVerificationStart(this.entityName)

    const totalAppointments = await this.prismaClient.appointment.count()

    const appointmentsByStatus = await this.prismaClient.appointment.groupBy({
      by: ['status'],
      _count: { status: true }
    })

    this.logInfo(this.entityName, `Total appointments: ${totalAppointments}`)

    for (const statusGroup of appointmentsByStatus) {
      this.logInfo(
        this.entityName,
        `Status "${statusGroup.status}": ${statusGroup._count.status} appointments`
      )
    }

    this.logVerificationComplete(this.entityName)
  }
}

import { prismaClient } from '../../src/lib/prisma'

export const appointmentSeeder = new AppointmentSeederService(prismaClient)
