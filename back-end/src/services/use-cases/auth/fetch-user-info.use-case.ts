import { Role, type Employee, type Customer } from '@prisma/client'
import { type CustomerRepository } from '../../../repository/protocols/customer.repository'
import { type EmployeeRepository } from '../../../repository/protocols/employee.repository'
import { InvalidRoleUseCaseError } from '../errors/invalid-role-use-case-error'

interface FetchUserInfoUseCaseInput {
  role: string
  userId: string
}

interface FetchUserInfoUseCaseOutput {
  user: Customer | Employee
}

class FetchUserInfoUseCase {
  constructor (
    private readonly customerRepository: CustomerRepository,
    private readonly employeeRepository: EmployeeRepository
  ) {}

  async execute ({ role, userId }: FetchUserInfoUseCaseInput): Promise<FetchUserInfoUseCaseOutput> {
    if (role === Role.CUSTOMER) {
      const customer = await this.customerRepository.findById(userId)
      if (customer == null) {
        throw new Error('Customer not found')
      }
      return { user: customer }
    } else if (role === Role.EMPLOYEE || role === Role.MANAGER) {
      const employee = await this.employeeRepository.findById(userId)
      if (employee == null) {
        throw new Error('Employee not found')
      }
      return { user: employee }
    } else {
      throw new InvalidRoleUseCaseError('Invalid role provided ' + role)
    }
  }
}

export { FetchUserInfoUseCase }
