import { vi } from 'vitest'
import { ProfessionalsUseCase } from '../../../services/professionals.use-case'
import * as factoryModule from '../../../factory/make-professionals-use-case.factory'
import { PrismaProfessionalRepository } from '../../../repository/prisma/prisma-professional.repository'

export function spyProfessionalsWiring () {
  const factory = vi.spyOn(factoryModule, 'makeProfessionalsUseCaseFactory')

  const usecase = {
    executeFindAllPaginated: vi.spyOn(ProfessionalsUseCase.prototype, 'executeFindAllPaginated'),
    executeCreate: vi.spyOn(ProfessionalsUseCase.prototype, 'executeCreate'),
    executeFindById: vi.spyOn(ProfessionalsUseCase.prototype, 'executeFindById'),
    executeUpdate: vi.spyOn(ProfessionalsUseCase.prototype, 'executeUpdate'),
    executeDelete: vi.spyOn(ProfessionalsUseCase.prototype, 'executeDelete')
  }

  const repository = {
    findAllPaginated: vi.spyOn(PrismaProfessionalRepository.prototype, 'findAllPaginated'),
    findAll: vi.spyOn(PrismaProfessionalRepository.prototype, 'findAll'),
    findById: vi.spyOn(PrismaProfessionalRepository.prototype, 'findById'),
    findByEmail: vi.spyOn(PrismaProfessionalRepository.prototype, 'findByEmail'),
    create: vi.spyOn(PrismaProfessionalRepository.prototype, 'create'),
    update: vi.spyOn(PrismaProfessionalRepository.prototype, 'update'),
    delete: vi.spyOn(PrismaProfessionalRepository.prototype, 'delete')
  }

  return {
    factory,
    usecase,
    repository
  }
}

export function restoreAllSpies () {
  // limpa qualquer spy aberto
  vi.restoreAllMocks()
}
