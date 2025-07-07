import { PrismaEmployeeRepository } from '../repository/prisma/prisma-employee.repository'
import { EmployeesUseCase } from '../services/employees.use-case'

function makeEmployeesUseCaseFactory () {
  const repository = new PrismaEmployeeRepository()
  const usecase = new EmployeesUseCase(repository)

  return usecase
}

export { makeEmployeesUseCaseFactory }
