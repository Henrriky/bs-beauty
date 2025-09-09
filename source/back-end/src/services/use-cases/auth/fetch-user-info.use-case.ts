import { UserType, type Professional, type Customer } from '@prisma/client'
import { type CustomerRepository } from '../../../repository/protocols/customer.repository'
import { type ProfessionalRepository } from '../../../repository/protocols/professional.repository'
import { InvalidUserTypeUseCaseError } from '../errors/invalid-user-type-use-case-error'
import { NotFoundUseCaseError } from '../errors/not-found-error'

interface FetchUserInfoUseCaseInput {
  userType: string
  email: string
}

interface FetchUserInfoUseCaseOutput {
  user: Customer | Professional
}

class FetchUserInfoUseCase {
  constructor (
    private readonly customerRepository: CustomerRepository,
    private readonly professionalRepository: ProfessionalRepository
  ) { }

  async execute ({ userType, email }: FetchUserInfoUseCaseInput): Promise<FetchUserInfoUseCaseOutput> {
    if (userType === UserType.CUSTOMER) {
      const customer = await this.customerRepository.findByEmailOrPhone(email, '')
      if (customer == null) {
        throw new NotFoundUseCaseError('Customer not found')
      }
      return { user: customer }
    } else if (userType === UserType.PROFESSIONAL || userType === UserType.MANAGER) {
      const professional = await this.professionalRepository.findByEmail(email)
      if (professional == null) {
        throw new NotFoundUseCaseError('Professional not found')
      }
      return { user: professional }
    } else {
      throw new InvalidUserTypeUseCaseError('Invalid user type provided ' + userType)
    }
  }
}

export { FetchUserInfoUseCase }
