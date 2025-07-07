import { type Employee, type Prisma } from '@prisma/client'
import { prismaClient } from '../../lib/prisma'
import { type PaginatedRequest } from '../../types/pagination'
import { type EmployeeRepository } from '../protocols/employee.repository'
import { type EmployeesFilters } from '../../types/employees/employees-filters'

class PrismaEmployeeRepository implements EmployeeRepository {
  public async findAll () {
    const employees = await prismaClient.employee.findMany({
      orderBy: { createdAt: 'asc' }
    })

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

  public async fetchServicesOfferedByEmployee (employeeId: string) {
    const employee = await prismaClient.employee.findUnique({
      where: {
        id: employeeId
      },
      select: {
        id: true,
        offers: {
          where: {
            isOffering: true
          },
          select: {
            id: true,
            estimatedTime: true,
            price: true,
            service: {
              select: {
                id: true,
                name: true,
                description: true,
                category: true
              }
            }
          }
        }
      }
    })

    if (employee == null) {
      throw new Error('Employee not found')
    }

    const mappedEmployee = {
      id: employee.id,
      offers: employee.offers.map(offer => ({
        id: offer.id,
        estimatedTime: offer.estimatedTime,
        price: offer.price,
        service: offer.service
      }))
    }

    return { employee: mappedEmployee }
  }

  public async findAllPaginated (
    params: PaginatedRequest<EmployeesFilters>
  ) {
    const { page, limit, filters } = params
    const skip = (page - 1) * limit

    const where = {
      name: ((filters?.name) != null) ? { contains: filters.name } : undefined,
      email: ((filters?.email) != null) ? { contains: filters.email } : undefined
    }

    const [data, total] = await Promise.all([
      prismaClient.employee.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'asc' }
      }),
      prismaClient.employee.count({ where })
    ])

    return {
      data,
      total,
      page,
      totalPages: Math.ceil(total / limit),
      limit
    }
  }
}

export { PrismaEmployeeRepository }
