import { type z } from 'zod'
import { type CustomerSchemas } from '../../../utils/validation/zod-schemas/customer.zod-schemas.validation.util'
import { type EmployeeSchemas } from '../../../utils/validation/zod-schemas/employee.zod-schemas.validation.utils'
import { Role } from '@prisma/client'
import { type CustomerRepository } from '../../../repository/protocols/customer.repository'
import { type EmployeeRepository } from '../../../repository/protocols/employee.repository'
import { InvalidRoleUseCaseError } from '../errors/invalid-role-use-case-error'

type CompleteCustomerOrEmployeeRegister = z.infer<typeof CustomerSchemas.customerCompleteRegisterBodySchema> | z.infer<typeof EmployeeSchemas.employeeCompleteRegisterBodySchema>

interface CompleteUserRegisterUseCaseInput {
  userData: CompleteCustomerOrEmployeeRegister
  userId: string
  userEmail: string
  userRole: Role
}

class CompleteUserRegisterUseCase {
  constructor (
    private readonly customerRepository: CustomerRepository,
    private readonly employeeRepository: EmployeeRepository
  ) {}

  async execute ({ userData, userId, userEmail, userRole }: CompleteUserRegisterUseCaseInput): Promise<void> {
    const data = {
      ...userData,
      registerCompleted: true
    }

    if (userRole === Role.CUSTOMER) {
      await this.customerRepository.updateByEmailAndGoogleId(
        userId,
        userEmail,
        data
      )
    } else if (userRole === Role.EMPLOYEE || userRole === Role.MANAGER) {
      await this.employeeRepository.updateByEmailAndGoogleId(
        userId,
        userEmail,
        data
      )
    } else {
      throw new InvalidRoleUseCaseError(`Invalid role provided ${userRole}`)
    }
  }
}

export { CompleteUserRegisterUseCase, type CompleteCustomerOrEmployeeRegister }
