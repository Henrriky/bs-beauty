// services/use-cases/auth/register-customer.use-case.ts
import { type CustomerRepository } from '../../../repository/protocols/customer.repository'
import { type EmployeeRepository } from '../../../repository/protocols/employee.repository'
import bcrypt from 'bcrypt'
import { Employee, UserType } from '@prisma/client'
import { CustomError } from '../../../utils/errors/custom.error.util'

interface RegisterUserInput {
  email: string
  password: string
}

export class RegisterUserUseCase {
  constructor(
    private readonly customerRepository: CustomerRepository,
    private readonly employeeRepository: EmployeeRepository
  ) { }

  async executeRegisterCustomer(input: RegisterUserInput): Promise<void> {
    const { email, password } = input

    const [customerByEmail, employeeByEmail] = await Promise.all([
      this.customerRepository.findByEmail(email),
      this.employeeRepository.findByEmail(email)
    ])

    if (customerByEmail || employeeByEmail) {
      throw new CustomError(
        `Bad Request`,
        400,
        `User with email '${email}' already exists`
      )
    }

    const passwordHash = await bcrypt.hash(password, 10)

    await this.customerRepository.create({
      email,
      userType: UserType.CUSTOMER,
      passwordHash,
      registerCompleted: false
    })
  }

  async executeRegisterEmployee(input: RegisterUserInput): Promise<void> {
      const { email, password } = input
  
      const passwordHash = await bcrypt.hash(password, 10)
  
      await this.employeeRepository.updateEmployeeByEmail(email, {
        email,
        passwordHash,
      })
    }
  
    async executeFindEmployeeByEmail(email: string): Promise<Employee | null> {
      const employeeByEmail = await this.employeeRepository.findByEmail(email)
  
      if (!employeeByEmail) {
        throw new CustomError(
          `Bad Request`,
          400,
          `Professional with email '${email}' does not exists`
        )
      }
  
      return employeeByEmail
    }
}
