import { type z } from 'zod'
import { type CustomerSchemas } from '../../../utils/validation/zod-schemas/customer.zod-schemas.validation.util'
import { type EmployeeSchemas } from '../../../utils/validation/zod-schemas/employee.zod-schemas.validation.utils'
import { UserType } from '@prisma/client'
import { type CustomerRepository } from '../../../repository/protocols/customer.repository'
import { type EmployeeRepository } from '../../../repository/protocols/employee.repository'
import { InvalidUserTypeUseCaseError } from '../errors/invalid-user-type-use-case-error'
import { ResourceWithAttributAlreadyExists } from '../errors/resource-with-attribute-alreay-exists'

type CompleteCustomerOrEmployeeRegister = z.infer<typeof CustomerSchemas.customerCompleteRegisterBodySchema> | z.infer<typeof EmployeeSchemas.employeeCompleteRegisterBodySchema>

interface CompleteUserRegisterUseCaseInput {
  userData: CompleteCustomerOrEmployeeRegister
  userId: string
  userEmail: string
  userType: UserType
}

class CompleteUserRegisterUseCase {
  constructor(
    private readonly customerRepository: CustomerRepository,
    private readonly employeeRepository: EmployeeRepository
  ) { }

  async execute ({ userData, userId, userEmail, userType }: CompleteUserRegisterUseCaseInput): Promise<void> {
    const data = {
      ...userData,
      registerCompleted: true
    }

    if (userType === UserType.CUSTOMER) {
      const userByPhone = await this.customerRepository.findByEmailOrPhone('', (data as z.infer<typeof CustomerSchemas.customerCompleteRegisterBodySchema>).phone)
      if (userByPhone != null) {
        throw new ResourceWithAttributAlreadyExists(
          'user',
          'phone',
          (data as z.infer<typeof CustomerSchemas.customerCompleteRegisterBodySchema>).phone
        )
      }

      await this.customerRepository.updateByEmailAndGoogleId(
        userId,
        userEmail,
        data
      )
    } else if (userType === UserType.EMPLOYEE || userType === UserType.MANAGER) {
      await this.employeeRepository.updateByEmailAndGoogleId(
        userId,
        userEmail,
        data
      )
    } else {
      throw new InvalidUserTypeUseCaseError(`Invalid user type provided ${userType}`)
    }
  }
}

export { CompleteUserRegisterUseCase, type CompleteCustomerOrEmployeeRegister }
