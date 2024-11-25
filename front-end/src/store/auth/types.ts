export enum Role {
  MANAGER = "MANAGER",
  CUSTOMER = "CUSTOMER",
  EMPLOYEE = "EMPLOYEE"
}

export interface CustomerOrEmployee {
  role: Role
  email: string
  name: string | null
  registerCompleted: boolean
}