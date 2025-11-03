import { WeekDays } from "../../enums/enums"
import { Permissions } from "../../types/authorization"

export enum UserType {
  MANAGER = "MANAGER",
  CUSTOMER = "CUSTOMER",
  PROFESSIONAL = "PROFESSIONAL"
}

export enum NotificationPreference {
  NONE = "NONE",
  IN_APP = 'IN_APP',
  ALL = 'ALL'
}

export interface CustomerOrProfessional {
  id: string
  name: string | null
  registerCompleted: boolean
  email: string
  userType: UserType
  profilePhotoUrl?: string
  permissions: Permissions[]
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
  alwaysAllowImageUse: boolean | null;
  userType: UserType;
  referrerId: string;
  referralCount: number;
  notificationPreference: NotificationPreference
  createdAt: Date;
  updatedAt: Date;
}

export type Professional = {
  id: string;
  name: string | null;
  email: string;
  googleId: string | null;
  registerCompleted: boolean;
  socialMedia: { name: string, url: string }[] | null;
  paymentMethods: { name: string, }[] | null;
  isCommissioned: boolean;
  commissionRate: number | null;
  contact: string | null;
  specialization: string | null;
  profilePhotoUrl: string;
  userType: UserType;
  notificationPreference: NotificationPreference
  createdAt: Date;
  updatedAt: Date;
}

export type FetchUserInfoRequest = void
export type FetchUserInfoCustomer = Customer
export type FetchUserInfoProfessional = Professional & { roles: string[] }
export type FetchUserInfoResponse = {
  user: FetchUserInfoCustomer | FetchUserInfoProfessional
}


export type Shift = {
  id: string;
  weekDay: WeekDays;
  isBusy: boolean;
  shiftStart: string;
  shiftEnd: string;
  professionalId: string;
  createdAt: Date;
  updatedAt: Date;
}