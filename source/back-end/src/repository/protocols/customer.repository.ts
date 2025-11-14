import { type Customer, type Prisma } from '@prisma/client'
import { type PaginatedRequest, type PaginatedResult } from '../../types/pagination'
import { type CustomersFilters } from '../../types/customers/customers-filters'

interface UpdateOrCreateParams {
  email?: string | undefined
  googleId?: string | undefined
  id?: string | undefined
}

interface CustomerRepository {
  findAll: () => Promise<Customer[]>
  findById: (customerId: string) => Promise<Customer | null>
  findByEmailOrPhone: (email: string, phone: string) => Promise<Customer | null>
  findByEmail: (email: string) => Promise<Customer | null>
  create: (newCustomer: Prisma.CustomerCreateInput) => Promise<Customer>
  update: (id: string, customerUpdated: Prisma.CustomerUpdateInput) => Promise<Customer>
  updateByEmailAndGoogleId: (googleId: string, email: string, customerData: Prisma.CustomerUpdateInput) => Promise<Customer>
  updateByEmail: (email: string, customerData: Prisma.CustomerUpdateInput) => Promise<Customer>
  updateOrCreate: (identifiers: UpdateOrCreateParams, data: Prisma.CustomerCreateInput) => Promise<Customer>
  delete: (id: string) => Promise<Customer>
  findAllPaginated: (params: PaginatedRequest<CustomersFilters>) => Promise<PaginatedResult<Customer>>
  findBirthdayCustomersOnCurrentDate: (date: Date, timezone: string) => Promise<Customer[]>
}

export type { CustomerRepository, UpdateOrCreateParams }
