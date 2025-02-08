import { type Customer, type Prisma } from '@prisma/client'
import { prismaClient } from '../../lib/prisma'
import { type UpdateOrCreateParams, type CustomerRepository } from '../protocols/customer.repository'

class PrismaCustomerRepository implements CustomerRepository {
  public async findAll () {
    const customers = await prismaClient.customer.findMany()

    return customers
  }

  public async findById (customerId: string) {
    const customer = await prismaClient.customer.findUnique({
      where: { id: customerId }
    })

    return customer
  }

  public async findByEmailOrPhone (email: string, phone: string) {
    const customer = await prismaClient.customer.findFirst({
      where: { OR: [{ email }, { phone }] }
    })

    return customer
  }

  public async create (newCustomer: Prisma.CustomerCreateInput) {
    const customer = await prismaClient.customer.create({
      data: { ...newCustomer }
    })

    return customer
  }

  public async update (customerId: string, customerToUpdate: Prisma.CustomerUpdateInput) {
    const customerUpdated = await prismaClient.customer.update({
      where: { id: customerId },
      data: { ...customerToUpdate }
    })

    return customerUpdated
  }

  async updateByEmailAndGoogleId (
    googleId: string,
    email: string,
    customerData: Prisma.CustomerUpdateInput
  ): Promise<Customer> {
    const customer = await prismaClient.customer.update({
      where: {
        email,
        googleId
      },
      data: {
        ...customerData,
        registerCompleted: true
      }
    })

    return customer
  }

  public async updateOrCreate (identifiers: UpdateOrCreateParams, data: Prisma.CustomerCreateInput): Promise<Customer> {
    const customerUpdated = await prismaClient.customer.upsert({
      where: {
        email: identifiers.email,
        googleId: identifiers.googleId,
        id: identifiers.id
      },
      update: {
        profilePhotoUrl: data.profilePhotoUrl
      },
      create: {
        ...data
      }
    })

    return customerUpdated
  }

  public async delete (customerId: string) {
    const customerDeleted = await prismaClient.customer.delete({
      where: { id: customerId }
    })

    return customerDeleted
  }
}

export { PrismaCustomerRepository }
