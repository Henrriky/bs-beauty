// services/use-cases/auth/register-customer.use-case.ts
import { type CustomerRepository } from '../../../repository/protocols/customer.repository'
import { type EmployeeRepository } from '../../../repository/protocols/employee.repository'
import { ResourceWithAttributAlreadyExists } from '../errors/resource-with-attribute-alreay-exists'
import bcrypt from 'bcrypt'
import { UserType } from '@prisma/client'
import { RecordExistence } from '../../../utils/validation/record-existence.validation.util'
import { CustomError } from '../../../utils/errors/custom.error.util'

interface RegisterCustomerInput {
  email: string
  password: string
  name?: string
  phone?: string
  birthdate?: string
}

export class RegisterCustomerUseCase {
  constructor(
    private readonly customerRepository: CustomerRepository,
    private readonly employeeRepository: EmployeeRepository
  ) { }

  async execute(input: RegisterCustomerInput): Promise<void> {
    const { email, password, name, phone, birthdate } = input

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
      name: name ?? 'Usuário',
      phone: phone ?? null,
      birthdate: birthdate ? new Date(birthdate) : null,
      userType: UserType.CUSTOMER,
      passwordHash,
      registerCompleted: false
    })

  }
}
