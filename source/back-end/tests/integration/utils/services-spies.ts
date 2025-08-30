import { vi } from 'vitest';
import { ServicesUseCase } from '../../../src/services/services.use-case';
import * as factoryModule from '../../../src/factory/make-service-use-case.factory';
import { PrismaServiceRepository } from '../../../src/repository/prisma/prisma-service.repository';

export function spyServicesWiring() {
  const factory = vi.spyOn(factoryModule, 'makeServiceUseCaseFactory');

  const usecase = {
    executeFindAllPaginated: vi.spyOn(ServicesUseCase.prototype, 'executeFindAllPaginated'),
    executeCreate: vi.spyOn(ServicesUseCase.prototype, 'executeCreate'),
    executeFindById: vi.spyOn(ServicesUseCase.prototype, 'executeFindById'),
    executeUpdate: vi.spyOn(ServicesUseCase.prototype, 'executeUpdate'),
    executeDelete: vi.spyOn(ServicesUseCase.prototype, 'executeDelete'),
  };

  const repository = {
    findAllPaginated: vi.spyOn(PrismaServiceRepository.prototype, 'findAllPaginated'),
    findAll: vi.spyOn(PrismaServiceRepository.prototype, 'findAll'),
    findById: vi.spyOn(PrismaServiceRepository.prototype, 'findById'),
    create: vi.spyOn(PrismaServiceRepository.prototype, 'create'),
    update: vi.spyOn(PrismaServiceRepository.prototype, 'update'),
    delete: vi.spyOn(PrismaServiceRepository.prototype, 'delete'),
  };

  return {
    factory,
    usecase,
    repository
  };
}

export function restoreAllSpies() {
  // limpa qualquer spy aberto
  vi.restoreAllMocks();
}
