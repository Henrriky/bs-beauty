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
  profilePhotoUrl: string
}

export type Customer = {
  name: string | null;
  id: string;
  registerCompleted: boolean;
  birthdate: Date | null;
  email: string;
  googleId: string | null;
  phone: string | null;
  role: Role;
  createdAt: Date;
  updatedAt: Date;
}

export type Employee = {
  name: string | null;
  id: string;
  registerCompleted: boolean;
  email: string;
  googleId: string | null;
  role: Role;
  createdAt: Date;
  updatedAt: Date;
  socialMedia: { name: string, url: string }[] | null;
  contact: string | null;
}
