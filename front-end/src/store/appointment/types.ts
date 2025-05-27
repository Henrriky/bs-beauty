import { z } from "zod"
import { AppointmentSchemas } from "../../utils/validation/zod-schemas/appointment.zod-schemas.validation.utils"
import { AppointmentServiceSchemas } from "../../utils/validation/zod-schemas/appointment-service.zod-schemas.validation.util"
import { Employee } from "../auth/types"

export enum Status {
  PENDING = "PENDING",
  CONFIRMED = "CONFIRMED",
  CANCELLED = "CANCELLED",
  RESCHEDULED = "RESCHEDULED",
  FINISHED = "FINISHED",
  NO_SHOW = "NO_SHOW"
}

export interface AvailableSchedulling {
  startTimestamp: number
  endTimestamp: number
  isBusy: boolean
}

export interface Appointment {
  id: string;
  observation: string | null;
  status: Status;
  createdAt: Date;
  updatedAt: Date;
  customerId: string;
}

export interface AppointmentService {
  observation: string | null;
  appointmentDate: string;
  status: Status;
  appointmentId: string;
  serviceOfferedId: string;
  id: string;
}

export interface FindAppointmentServiceByCustomerId {
  id: string
  observation: string | null
  status: Status
  appointmentDate: string
  appointment: Appointment
  serviceOffered: {
    id: string
    estimatedTime: number
    employee: Employee
    service: {
      name: string
    }
  }
}
export interface FindAppointmentServiceById {
  id: string
  observation: string | null
  status: Status
  appointmentDate: string
  appointment: {
    customerId: string
  }
  serviceOffered: {
    id: string
    estimatedTime: number
    price: string
    employee: Employee
    service: {
      name: string
    }
  }
}

export type CreateAppointmentAPIData = z.infer<typeof AppointmentSchemas.createSchema>
export type AssociateAppointmentAPIData = z.infer<typeof AppointmentServiceSchemas.createSchema>
