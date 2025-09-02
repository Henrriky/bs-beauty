import { type Customer, type Prisma } from '@prisma/client'
import { prismaClient } from '../../lib/prisma'
import { type UpdateOrCreateParams, type CustomerRepository } from '../protocols/customer.repository'
import { type CustomersFilters } from '../../types/customers/customers-filters'
import { type PaginatedRequest } from '../../types/pagination'

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

  public async findAllPaginated (params: PaginatedRequest<CustomersFilters>) {
    const { page, limit, filters } = params
    const skip = (page - 1) * limit

    const where = {
      name: (filters.name != null) ? { contains: filters.name } : undefined,
      email: (filters.email != null) ? { contains: filters.email } : undefined
    }

    const [data, total] = await Promise.all([
      prismaClient.customer.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'asc' }
      }),
      prismaClient.customer.count({ where })
    ])

    return {
      data,
      total,
      page,
      totalPages: Math.ceil(total / limit),
      limit
    }
  }
}

export { PrismaCustomerRepository }
