import { PrismaCustomerRepository } from '../repository/prisma/prisma-customer.repository'
import { PrismaEmployeeRepository } from '../repository/prisma/prisma-employee.repository'
import { JwtEncrypterService } from '../services/encrypter/jwt-encrypter.service'
import { GoogleAuthIdentityProvider } from '../services/identity-providers/google-oauth-identity-provider.service'
import { LoginUseCase } from '../services/use-cases/login.use-case'

function makeLoginUseCase () {
  const customerRepository = new PrismaCustomerRepository()
  const employeeRepository = new PrismaEmployeeRepository()
  const encrypter = new JwtEncrypterService()
  const identityProvider = new GoogleAuthIdentityProvider()
  const usecase = new LoginUseCase(
    customerRepository,
    employeeRepository,
    encrypter,
    identityProvider
  )

  return usecase
}

export { makeLoginUseCase }
