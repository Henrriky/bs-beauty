import { type Employee, type Prisma } from '@prisma/client'

interface EmployeeRepository {
  findAll: () => Promise<Employee[]>
  findById: (customerId: string) => Promise<Employee | null>
  create: (newCustomer: Prisma.EmployeeCreateInput) => Promise<Employee>
  update: (id: string, customerUpdated: Prisma.EmployeeUpdateInput) => Promise<Employee>
  delete: (id: string) => Promise<Employee>
}

export type { EmployeeRepository }
