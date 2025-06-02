import { UserType, type Employee, type Customer } from '@prisma/client'
import { type CustomerRepository } from '../../../repository/protocols/customer.repository'
import { type EmployeeRepository } from '../../../repository/protocols/employee.repository'
import { InvalidRoleUseCaseError } from '../errors/invalid-role-use-case-error'
import { NotFoundUseCaseError } from '../errors/not-found-error'

interface FetchUserInfoUseCaseInput {
  userType: string
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

  async execute ({ userType, email }: FetchUserInfoUseCaseInput): Promise<FetchUserInfoUseCaseOutput> {
    if (userType === UserType.CUSTOMER) {
      const customer = await this.customerRepository.findByEmailOrPhone(email, '')
      if (customer == null) {
        throw new NotFoundUseCaseError('Customer not found')
      }
      return { user: customer }
    } else if (userType === UserType.EMPLOYEE || userType === UserType.MANAGER) {
      const employee = await this.employeeRepository.findByEmail(email)
      if (employee == null) {
        throw new NotFoundUseCaseError('Employee not found')
      }
      return { user: employee }
    } else {
      throw new InvalidRoleUseCaseError('Invalid user type provided ' + userType)
    }
  }
}

export { FetchUserInfoUseCase }
