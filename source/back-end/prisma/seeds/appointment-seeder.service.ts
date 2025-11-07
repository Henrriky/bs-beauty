import { PrismaClient } from '@prisma/client'
import { AppLoggerInstance } from '../../src/utils/logger/logger.util'
import { generateAppointmentsData } from './data/appointments.data'

export class AppointmentSeederService {
  private readonly logger = AppLoggerInstance

  constructor(private readonly prismaClient: PrismaClient) { }

  async seedAppointments(): Promise<void> {
    this.logger.info('[APPOINTMENT SEED] Starting appointment seeding...')

    const appointments = generateAppointmentsData()
    let createdCount = 0
    let skippedCount = 0

    for (const appointment of appointments) {
      const customer = await this.prismaClient.customer.findUnique({
        where: { email: appointment.customerEmail }
      })

      if (!customer) {
        this.logger.warn(`[APPOINTMENT SEED] Customer not found: ${appointment.customerEmail}`)
        skippedCount++
        continue
      }

      const professional = await this.prismaClient.professional.findFirst({
        where: { name: appointment.professionalName }
      })

      if (!professional) {
        this.logger.warn(`[APPOINTMENT SEED] Professional not found: ${appointment.professionalName}`)
        skippedCount++
        continue
      }

      const service = await this.prismaClient.service.findFirst({
        where: { name: appointment.serviceName }
      })

      if (!service) {
        this.logger.warn(`[APPOINTMENT SEED] Service not found: ${appointment.serviceName}`)
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
        this.logger.warn(
          `[APPOINTMENT SEED] Offer not found for professional "${appointment.professionalName}" and service "${appointment.serviceName}"`
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
        this.logger.info(
          `[APPOINTMENT SEED] Appointment already exists for customer ${customer.email} on ${appointment.appointmentDate.toISOString()}`
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

    this.logger.info(
      `[APPOINTMENT SEED] Appointment seeding completed: ${createdCount} created, ${skippedCount} skipped`
    )
  }

  async verifyAppointments(): Promise<void> {
    this.logger.info('[APPOINTMENT SEED] Verifying appointments...')

    const totalAppointments = await this.prismaClient.appointment.count()

    const appointmentsByStatus = await this.prismaClient.appointment.groupBy({
      by: ['status'],
      _count: {
        status: true
      }
    })

    this.logger.info(`[APPOINTMENT SEED] Total appointments: ${totalAppointments}`)

    for (const statusGroup of appointmentsByStatus) {
      this.logger.info(
        `[APPOINTMENT SEED] Status "${statusGroup.status}": ${statusGroup._count.status} appointments`
      )
    }

    this.logger.info('[APPOINTMENT SEED] Appointment verification completed')
  }
}

import { prismaClient } from '../../src/lib/prisma'

export const appointmentSeeder = new AppointmentSeederService(prismaClient)
