import { WeekDays } from "../../enums/enums"

export enum UserType {
  MANAGER = "MANAGER",
  CUSTOMER = "CUSTOMER",
  EMPLOYEE = "EMPLOYEE"
}

export interface CustomerOrEmployee {
  id: string
  name: string | null
  registerCompleted: boolean
  email: string
  userType: UserType
  profilePhotoUrl: string
}

export type Customer = {
  id: string;
  name: string | null;
  registerCompleted: boolean;
  birthdate: Date | null;
  email: string;
  googleId: string | null;
  phone: string | null;
  profilePhotoUrl: string | null;
  userType: UserType;
  referrerId: string;
  referralCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export type Employee = {
  id: string;
  name: string | null;
  email: string;
  googleId: string | null;
  registerCompleted: boolean;
  socialMedia: { name: string, url: string }[] | null;
  contact: string | null;
  specialization: string | null;
  profilePhotoUrl: string;
  userType: UserType;
  createdAt: Date;
  updatedAt: Date;
}

export type Shift = {
  id: string;
  weekDay: WeekDays;
  isBusy: boolean;
  shiftStart: string;
  shiftEnd: string;
  employeeId: string;
  createdAt: Date;
  updatedAt: Date;
}