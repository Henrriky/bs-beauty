import { PrismaCustomerRepository } from "@/repository/prisma/prisma-customer.repository";
import { PrismaEmployeeRepository } from "@/repository/prisma/prisma-employee.repository";
import { RedisCacheProvider } from "@/services/cache/redis-cache-provider.service";
import { JwtEncrypterService } from "@/services/encrypter/jwt-encrypter.service";
import { RefreshTokenService } from "@/services/encrypter/refresh-token.service";
import { GenerateTokensUseCase } from "@/services/use-cases/auth/generate-tokens.use-case";

function makeGenerateTokensUseCase() {
  const customerRepository = new PrismaCustomerRepository();
  const employeeRepository = new PrismaEmployeeRepository();
  const encrypter = new JwtEncrypterService();
  const cache = new RedisCacheProvider()
  const refreshTokenService = new RefreshTokenService(cache);
  const usecase = new GenerateTokensUseCase(
    customerRepository,
    employeeRepository,
    encrypter,
    refreshTokenService
  )

  return usecase
}

export { makeGenerateTokensUseCase }