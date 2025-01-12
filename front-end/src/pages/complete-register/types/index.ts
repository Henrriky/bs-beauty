import { z } from 'zod'
import { CustomerSchemas } from '../../../utils/validation/zod-schemas/customer.zod-schemas.validation.util'
import { EmployeeSchemas } from '../../../utils/validation/zod-schemas/employee.zod-schemas.validation.utils'

type CustomerCompleteRegisterFormData = z.infer<
  typeof CustomerSchemas.customerCompleteRegisterBodySchema
>

type EmployeeCompleteRegisterFormData = z.infer<
  typeof EmployeeSchemas.employeeUpdateSchema
>

type OnSubmitEmployeeOrCustomerForm = (
  data: CustomerCompleteRegisterFormData | EmployeeCompleteRegisterFormData,
) => Promise<void>

export type {
  CustomerCompleteRegisterFormData,
  EmployeeCompleteRegisterFormData,
  OnSubmitEmployeeOrCustomerForm,
}
