import { prismaClient } from '@/lib/prisma'
import { faker } from '@faker-js/faker'
import { type Appointment, type Prisma } from '@prisma/client'
import { CustomerFactory } from './customer.factory'
import { OfferFactory } from './offer.factory'

export class AppointmentsFactory {
  static async makeAppointments (data: Partial<Prisma.AppointmentCreateInput> = {}): Promise<Appointment> {
    const Appointments = await prismaClient.appointment.create({
      data: {
        appointmentDate: faker.date.soon(),
        customer: data.customer ?? { connect: { id: (await CustomerFactory.makeCustomer()).id } },
        offer: data.offer ?? { connect: { id: (await OfferFactory.makeOffer()).id } },
        ...data
      }
    })

    return Appointments
  }
}
