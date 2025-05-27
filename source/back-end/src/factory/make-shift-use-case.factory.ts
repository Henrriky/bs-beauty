import { PrismaShiftRepository } from '../repository/prisma/prisma-shift.repository'
import { ShiftUseCase } from '../services/shifts.use-case'

function makeShiftUseCaseFactory () {
  const repository = new PrismaShiftRepository()
  const useCase = new ShiftUseCase(repository)

  return useCase
}

export { makeShiftUseCaseFactory }
