import { type Encrypter } from '../../protocols/encrypter.protocol'
import { type CustomerRepository } from '../../../repository/protocols/customer.repository'
import { type EmployeeRepository } from '../../../repository/protocols/employee.repository'
import { type CustomerOrEmployee } from '../../../types/customer-or-employee.type'
import { type OAuthIdentityProvider } from '../../protocols/oauth-identity-provider.protocol'

interface LoginUseCaseInput {
  token: string
}

interface LoginUseCaseOutput {
  accessToken: string
}

class LoginUseCase {
  constructor (
    private readonly customerRepository: CustomerRepository,
    private readonly employeeRepository: EmployeeRepository,
    private readonly encrypter: Encrypter,
    private readonly identityProvider: OAuthIdentityProvider
  ) {

  }

  async execute ({ token }: LoginUseCaseInput): Promise<LoginUseCaseOutput> {
    const { userId, email, profilePhotoUrl } = await this.identityProvider.fetchUserInformationsFromToken(token)

    let customerOrEmployee: CustomerOrEmployee
    const employeeAlreadyExists = await this.employeeRepository.findByEmail(email)
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    if (!employeeAlreadyExists) {
      customerOrEmployee = await this.customerRepository.updateOrCreate({
        googleId: userId,
        email
      }, {
        email,
        googleId: userId,
        profilePhotoUrl
      })
    } else {
      customerOrEmployee = await this.employeeRepository.updateEmployeeByEmail(email, {
        googleId: userId,
        profilePhotoUrl
      })
    }

    const { accessToken } = await this.encrypter.encrypt({
      userId,
      role: customerOrEmployee.role,
      email: customerOrEmployee.email,
      name: customerOrEmployee.name,
      registerCompleted: customerOrEmployee.registerCompleted,
      profilePhotoUrl
    })

    return { accessToken }
  }
}

export { LoginUseCase }
