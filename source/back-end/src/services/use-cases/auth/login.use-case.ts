import { type Encrypter } from '../../protocols/encrypter.protocol'
import { type CustomerRepository } from '../../../repository/protocols/customer.repository'
import { type EmployeeRepository } from '../../../repository/protocols/employee.repository'
import { type CustomerOrEmployee } from '../../../types/customer-or-employee.type'
import { type OAuthIdentityProvider } from '../../protocols/oauth-identity-provider.protocol'
import bcrypt from 'bcrypt'
import { CustomError } from '../../../utils/errors/custom.error.util'

interface LoginUseCaseInput {
  token?: string
  email?: string
  password?: string
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

  async execute({ token, email, password }: LoginUseCaseInput): Promise<LoginUseCaseOutput> {
    let customerOrEmployee: CustomerOrEmployee | null = null

    if (token) {
      const { userId, email, profilePhotoUrl } = await this.identityProvider.fetchUserInformationsFromToken(token)

      const employeeAlreadyExists = await this.employeeRepository.findByEmail(email)
      // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
      if (!employeeAlreadyExists) {
        const customer = await this.customerRepository.updateOrCreate({
          email
        }, {
          email,
          googleId: userId,
          profilePhotoUrl
        })
        customerOrEmployee = {
          ...customer,
          userId
        }
      } else {
        const employee = await this.employeeRepository.updateEmployeeByEmail(email, {
          googleId: userId,
          profilePhotoUrl
        })
        customerOrEmployee = {
          ...employee,
          userId
        }
      }

      const { accessToken } = await this.encrypter.encrypt({
        userId,
        id: customerOrEmployee.id,
        userType: customerOrEmployee.userType,
        email: customerOrEmployee.email,
        name: customerOrEmployee.name,
        registerCompleted: customerOrEmployee.registerCompleted,
        profilePhotoUrl
      })

      return { accessToken }
    } else if (email && password) {
      const customer = await this.customerRepository.findByEmail(email)
      const employee = await this.employeeRepository.findByEmail(email)

      const user = customer ?? employee

      let isPasswordValid: boolean = false;

      if (user) {
        isPasswordValid = await bcrypt.compare(password, user!.passwordHash!)
      }

      if (!user || !isPasswordValid) {
        throw new CustomError(
          'Bad Request',
          400,
          'Invalid credentials'
        )
      }

      customerOrEmployee = { ...user, userId: user.id } as CustomerOrEmployee

      const userId = customerOrEmployee.id
      const profilePhotoUrl = customerOrEmployee.profilePhotoUrl ?? ''

      const { accessToken } = await this.encrypter.encrypt({
        userId,
        id: customerOrEmployee.id,
        userType: customerOrEmployee.userType,
        email: customerOrEmployee.email,
        name: customerOrEmployee.name,
        registerCompleted: customerOrEmployee.registerCompleted,
        profilePhotoUrl
      })

      return { accessToken }
    }

    throw new Error('Invalid credentials') 
  }
}

export { LoginUseCase }
