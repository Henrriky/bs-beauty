import { prismaClient } from '@/lib/prisma'
import { faker } from '@faker-js/faker'
import { type Appointment, type Prisma } from '@prisma/client'
import { CustomerFactory } from './customer.factory'
import { OfferFactory } from './offer.factory'

export class AppointmentsFactory {
  static async makeAppointments (data: Partial<Prisma.AppointmentCreateInput> = {}): Promise<Appointment> {
    // normalize shorthand foreign keys to nested connect objects accepted by prisma
    const customerConnect = data.customer ?? (data as any).customerId ? { connect: { id: (data as any).customerId } } : { connect: { id: (await CustomerFactory.makeCustomer()).id } }
    const offerConnect = data.offer ?? (data as any).serviceOfferedId ? { connect: { id: (data as any).serviceOfferedId } } : { connect: { id: (await OfferFactory.makeOffer()).id } }

    // remove flat ids from the payload to prevent Prisma complaining about unknown args
    const sanitizedData: any = { ...data }
    delete sanitizedData.customerId
    delete sanitizedData.serviceOfferedId

    const Appointments = await prismaClient.appointment.create({
      data: {
        appointmentDate: data.appointmentDate ?? faker.date.soon(),
        customer: customerConnect,
        offer: offerConnect,
        ...sanitizedData
      }
    })

    return Appointments
  }
}
