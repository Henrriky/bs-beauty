import { PrismaSalonSettingsRepository } from '@/repository/prisma/prisma-salon-settings.repository';
import { SalonSettingsUseCase } from '@/services/salon-settings.use-case';

function makeSalonSettingsUseCaseFactory() {
  const repository = new PrismaSalonSettingsRepository()
  const useCase = new SalonSettingsUseCase(repository)

  return useCase
}

export { makeSalonSettingsUseCaseFactory }
