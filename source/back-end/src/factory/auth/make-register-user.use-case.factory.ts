import { RedisCacheProvider } from '@/services/cache/redis-cache-provider.service'
import { EmailService } from '@/services/email/email.service'
import { CodeValidationService } from '@/services/use-cases/auth/code-validation.service'
import { PrismaCustomerRepository } from '../../repository/prisma/prisma-customer.repository'
import { PrismaEmployeeRepository } from '../../repository/prisma/prisma-employee.repository'
import { RegisterUserUseCase } from '../../services/use-cases/auth/register-user.use-case'

const makeRegisterUserUseCase = () => {
  const customerRepo = new PrismaCustomerRepository()
  const employeeRepo = new PrismaEmployeeRepository()
  const cacheService = new RedisCacheProvider()
  const codeVerificationService = new CodeValidationService(cacheService)
  const emailService = new EmailService()

  const usecase = new RegisterUserUseCase(
    customerRepo,
    employeeRepo,
    codeVerificationService,
    emailService
  )
  return usecase
}

export { makeRegisterUserUseCase }
