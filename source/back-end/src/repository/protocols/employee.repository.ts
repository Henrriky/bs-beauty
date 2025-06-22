import { type Employee, type Prisma } from '@prisma/client'
import { type PaginatedRequest, type PaginatedResult } from '../../types/pagination'
import { type EmployeeFilters } from '../../types/employees/employee-filters'

interface EmployeeRepository {
  findAll: () => Promise<Employee[]>
  findById: (customerId: string) => Promise<Employee | null>
  findByEmail: (email: string) => Promise<Employee | null>
  create: (newCustomer: Prisma.EmployeeCreateInput) => Promise<Employee>
  update: (id: string, customerUpdated: Prisma.EmployeeUpdateInput) => Promise<Employee>
  updateByEmailAndGoogleId: (googleId: string, email: string, customerUpdated: Prisma.EmployeeUpdateInput) => Promise<Employee>
  updateEmployeeByEmail: (email: string, customerUpdated: Prisma.EmployeeUpdateInput) => Promise<Employee>
  delete: (id: string) => Promise<Employee>
  findAllPaginated: (params: PaginatedRequest<EmployeeFilters>) => Promise<PaginatedResult<Employee>>
}

export type { EmployeeRepository }
