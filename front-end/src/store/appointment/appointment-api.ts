import { createApi } from '@reduxjs/toolkit/query/react'
import { baseQueryWithAuth } from '../fetch-base/custom-fetch-base'
import { API_VARIABLES } from '../../api/config'
import {
  Appointment,
  AppointmentService,
  AssociateAppointmentAPIData,
  CreateAppointmentAPIData,
} from './types'

export const appointmentAPI = createApi({
  reducerPath: 'appointments',
  baseQuery: baseQueryWithAuth,
  endpoints: (builder) => ({
    makeAppointment: builder.mutation<Appointment, CreateAppointmentAPIData>({
      query: (data) => ({
        url: API_VARIABLES.APPOINTMENTS_ENDPOINTS.CREATE_APPOINTMENT,
        method: 'POST',
        body: data,
      }),
    }),
    associateOfferWithAppointment: builder.mutation<
      { appointmentServices: AppointmentService[] },
      AssociateAppointmentAPIData
    >({
      query: (data) => ({
        url: API_VARIABLES.APPOINTMENTS_ENDPOINTS
          .ASSOCIATE_APPOINTMENT_WITH_OFFER,
        method: 'POST',
        body: data,
      }),
    }),
  }),
})
