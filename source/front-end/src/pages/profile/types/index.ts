import { z } from 'zod'
import { CustomerSchemas } from '../../../utils/validation/zod-schemas/customer.zod-schemas.validation.util'
import { EmployeeSchemas } from '../../../utils/validation/zod-schemas/employee.zod-schemas.validation.utils'

type CustomerUpdateProfileFormData = z.infer<
  typeof CustomerSchemas.updateSchema
>

type EmployeeUpdateProfileFormData = z.infer<
  typeof EmployeeSchemas.employeeUpdateSchema
>

type ManagerUpdateProfileFormData = z.infer<
  typeof EmployeeSchemas.managerUpdateSchema
>

export type {
  CustomerUpdateProfileFormData,
  EmployeeUpdateProfileFormData,
  ManagerUpdateProfileFormData,
}
