import { type Encrypter } from '../../protocols/encrypter.protocol'
import { type CustomerRepository } from '../../../repository/protocols/customer.repository'
import { type ProfessionalRepository } from '../../../repository/protocols/professional.repository'
import { type CustomerOrProfessional } from '../../../types/customer-or-professional.type'
import { type OAuthIdentityProvider } from '../../protocols/oauth-identity-provider.protocol'

interface LoginUseCaseInput {
  token: string
}

interface LoginUseCaseOutput {
  accessToken: string
}

class LoginUseCase {
  constructor(
    private readonly customerRepository: CustomerRepository,
    private readonly professionalRepository: ProfessionalRepository,
    private readonly encrypter: Encrypter,
    private readonly identityProvider: OAuthIdentityProvider
  ) {

  }

  async execute({ token }: LoginUseCaseInput): Promise<LoginUseCaseOutput> {
    const { userId, email, profilePhotoUrl } = await this.identityProvider.fetchUserInformationsFromToken(token)

    let customerOrProfessional: CustomerOrProfessional
    const professionalAlreadyExists = await this.professionalRepository.findByEmail(email)
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    if (!professionalAlreadyExists) {
      const customer = await this.customerRepository.updateOrCreate({
        googleId: userId,
        email
      }, {
        email,
        googleId: userId,
        profilePhotoUrl
      })
      customerOrProfessional = {
        ...customer,
        userId
      }
    } else {
      const professional = await this.professionalRepository.updateProfessionalByEmail(email, {
        googleId: userId,
        profilePhotoUrl
      })
      customerOrProfessional = {
        ...professional,
        userId
      }
    }

    const { accessToken } = await this.encrypter.encrypt({
      userId,
      id: customerOrProfessional.id,
      userType: customerOrProfessional.userType,
      email: customerOrProfessional.email,
      name: customerOrProfessional.name,
      registerCompleted: customerOrProfessional.registerCompleted,
      profilePhotoUrl
    })

    return { accessToken }
  }
}

export { LoginUseCase }
