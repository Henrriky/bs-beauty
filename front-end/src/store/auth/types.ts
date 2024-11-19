enum Role {
  MANAGER,
  CUSTOMER,
  EMPLOYEE
}

export interface CustomerOrEmployee {
  role: Role
  email: string
  name: string | null
  registerCompleted: boolean
}