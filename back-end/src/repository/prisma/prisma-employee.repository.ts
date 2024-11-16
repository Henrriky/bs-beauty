import { type Employee, type Prisma } from '@prisma/client'
import { prismaClient } from '../../lib/prisma'
import { type EmployeeRepository } from '../protocols/employee.repository'

class PrismaEmployeeRepository implements EmployeeRepository {
  public async findAll () {
    const employees = await prismaClient.employee.findMany()

    return employees
  }

  public async findById (employeeId: string) {
    const employee = await prismaClient.employee.findUnique({
      where: { id: employeeId }
    })

    return employee
  }

  public async findByEmail (email: string) {
    const employee = await prismaClient.employee.findUnique({
      where: { email }
    })
    return employee
  }

  public async create (newEmployee: Prisma.EmployeeCreateInput) {
    const employee = await prismaClient.employee.create({
      data: { ...newEmployee }
    })

    return employee
  }

  public async update (employeeId: string, employeeToUpdate: Prisma.EmployeeUpdateInput) {
    const employeeUpdated = await prismaClient.employee.update({
      where: { id: employeeId },
      data: { ...employeeToUpdate }
    })

    return employeeUpdated
  }

  async updateByEmailAndGoogleId (
    googleId: string,
    email: string,
    employeeData: Prisma.EmployeeUpdateInput
  ): Promise<Employee> {
    const employee = await prismaClient.employee.update({
      where: {
        email,
        googleId
      },
      data: {
        ...employeeData,
        registerCompleted: true
      }
    })

    return employee
  }

  public async updateEmployeeByEmail (email: string, employeeToUpdate: Prisma.EmployeeUpdateInput) {
    const employeeUpdated = await prismaClient.employee.update({
      where: { email },
      data: { ...employeeToUpdate }
    })

    return employeeUpdated
  }

  public async delete (employeeId: string) {
    const employeeDeleted = await prismaClient.employee.delete({
      where: { id: employeeId }
    })

    return employeeDeleted
  }
}

export { PrismaEmployeeRepository }
