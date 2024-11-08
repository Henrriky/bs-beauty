import { type Prisma } from '@prisma/client'
import { prismaClient } from '../../lib/prisma'
import { type CustomerRepository } from '../protocols/customer.repository'

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

  public async delete (customerId: string) {
    const customerDeleted = await prismaClient.customer.delete({
      where: { id: customerId }
    })

    return customerDeleted
  }
}

export { PrismaCustomerRepository }
