import { vi } from 'vitest';
import { EmployeesUseCase } from '../../../services/employees.use-case';
import * as factoryModule from '../../../factory/make-employees-use-case.factory';
import { PrismaEmployeeRepository } from '../../../repository/prisma/prisma-employee.repository';

export function spyEmployeesWiring() {
  const factory = vi.spyOn(factoryModule, 'makeEmployeesUseCaseFactory');

  const usecase = {
    executeFindAllPaginated: vi.spyOn(EmployeesUseCase.prototype, 'executeFindAllPaginated'),
    executeCreate: vi.spyOn(EmployeesUseCase.prototype, 'executeCreate'),
    executeFindById: vi.spyOn(EmployeesUseCase.prototype, 'executeFindById'),
    executeUpdate: vi.spyOn(EmployeesUseCase.prototype, 'executeUpdate'),
    executeDelete: vi.spyOn(EmployeesUseCase.prototype, 'executeDelete'),
  };

  const repository = {
    findAllPaginated: vi.spyOn(PrismaEmployeeRepository.prototype, 'findAllPaginated'),
    findAll: vi.spyOn(PrismaEmployeeRepository.prototype, 'findAll'),
    findById: vi.spyOn(PrismaEmployeeRepository.prototype, 'findById'),
    findByEmail: vi.spyOn(PrismaEmployeeRepository.prototype, 'findByEmail'),
    create: vi.spyOn(PrismaEmployeeRepository.prototype, 'create'),
    update: vi.spyOn(PrismaEmployeeRepository.prototype, 'update'),
    delete: vi.spyOn(PrismaEmployeeRepository.prototype, 'delete'),
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
