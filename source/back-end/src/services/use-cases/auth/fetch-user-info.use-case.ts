import { Role, type Employee, type Customer } from '@prisma/client'
import { type CustomerRepository } from '../../../repository/protocols/customer.repository'
import { type EmployeeRepository } from '../../../repository/protocols/employee.repository'
import { InvalidRoleUseCaseError } from '../errors/invalid-role-use-case-error'
import { NotFoundUseCaseError } from '../errors/not-found-error'

interface FetchUserInfoUseCaseInput {
  role: string
  email: string
}

interface FetchUserInfoUseCaseOutput {
  user: Customer | Employee
}

class FetchUserInfoUseCase {
  constructor (
    private readonly customerRepository: CustomerRepository,
    private readonly employeeRepository: EmployeeRepository
  ) {}

  async execute ({ role, email }: FetchUserInfoUseCaseInput): Promise<FetchUserInfoUseCaseOutput> {
    
    if (role === Role.CUSTOMER) {
      const customer = await this.customerRepository.findByEmailOrPhone(email, '')
      if (customer == null) {
        throw new NotFoundUseCaseError('Customer not found')
      }
      return { user: customer }
    } else if (role === Role.EMPLOYEE || role === Role.MANAGER) {
      const employee = await this.employeeRepository.findByEmail(email)
      if (employee == null) {
        throw new NotFoundUseCaseError('Employee not found')
      }
      return { user: employee }
    } else {
      throw new InvalidRoleUseCaseError('Invalid role provided ' + role)
    }
  }
}

export { FetchUserInfoUseCase }
