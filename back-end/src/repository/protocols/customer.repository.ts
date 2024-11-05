import { type Customer, type Prisma } from '@prisma/client'

interface CustomerRepository {
  findAll: () => Promise<Customer[]>
  findById: (customerId: string) => Promise<Customer | null>
  findByEmailOrPhone: (email: string, phone: string) => Promise<Customer | null>
  create: (newCustomer: Prisma.CustomerCreateInput) => Promise<Customer>
  update: (id: string, customerUpdated: Prisma.CustomerUpdateInput) => Promise<Customer>
  delete: (id: string) => Promise<Customer>
}

export type { CustomerRepository }
