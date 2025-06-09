/* eslint-disable @typescript-eslint/ban-ts-comment */
// TODO: Solve errors

import { createApi } from '@reduxjs/toolkit/query/react'
import { API_VARIABLES } from '../../api/config'
import {
  CustomerUpdateAppointmentFormData,
  EmployeeUpdateAppointmentFormData,
} from '../../pages/appointments/types'
import { baseQueryWithAuth } from '../fetch-base/custom-fetch-base'
import {
  Appointment,
  CreateAppointmentAPIData,
  FindAppointmentByCustomerId,
  FindAppointmentById
} from './types'

export const appointmentAPI = createApi({
  reducerPath: 'appointments',
  baseQuery: baseQueryWithAuth,
  tagTypes: ['Appointments'],
  endpoints: (builder) => ({
    makeAppointment: builder.mutation<Appointment, CreateAppointmentAPIData>({
      query: (data) => ({
        url: API_VARIABLES.APPOINTMENTS_ENDPOINTS.CREATE_APPOINTMENT,
        method: 'POST',
        body: data,
      }),
    }),
    updateAppointmentService: builder.mutation<
      void,
      (
        | CustomerUpdateAppointmentFormData
        | EmployeeUpdateAppointmentFormData
      ) & { id: string }
    >({
      query: (data) => ({
        url: API_VARIABLES.APPOINTMENTS_ENDPOINTS.UPDATE_APPOINTMENT(
          data.id,
        ),
        method: 'PUT',
        body: {
          ...data,
          id: undefined,
        },
      }),
    }),
    findAppointmentsByCustomerOrEmployeeId: builder.query<
      {
        appointments: FindAppointmentByCustomerId[]
      },
      void
    >({
      query: () => ({
        url: API_VARIABLES.APPOINTMENTS_ENDPOINTS.FETCH_CUSTOMER_APPOINTMENTS,
        method: 'GET',
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.appointments.map(({ id }) => ({
                type: 'Appointments' as const,
                id,
              })),
            ]
          : [{ type: 'Appointments', id: 'LIST' }],
    }),
    findAppointmentsByServiceOfferedId: builder.query<
      Appointment[],
      { serviceOfferedId: string }
    >({
      query: ({ serviceOfferedId }) => ({
        url: API_VARIABLES.APPOINTMENTS_ENDPOINTS.FIND_BY_SERVICE_OFFERED(
          serviceOfferedId,
        ),
        method: 'GET',
      }),
    }),
    fetchEmployeeAppointmentsByAllOffers: builder.query<
      { appointments: Appointment[] },
      string
    >({
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      async queryFn(userId, _queryApi, _extraOptions, fetchWithBQ) {
        try {
          const offersResponse = await fetchWithBQ({
            url: `/offers/employee/${userId}`,
          })

          const serviceOfferedIds =
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            offersResponse.data?.data?.map((offer) => offer.id) || []
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-expect-error
          const appointmentPromises = serviceOfferedIds.map((id) =>
            fetchWithBQ({
              url: API_VARIABLES.APPOINTMENTS_ENDPOINTS.FIND_BY_SERVICE_OFFERED(
                id,
              ),
            }),
          )

          const appointmentResponses = await Promise.all(appointmentPromises)

          const allAppointments = appointmentResponses
            .filter(
              (response: { data?: { appointments?: Appointment[] } }) =>
                Array.isArray(response.data?.appointments),
            )
            .flatMap(
              (response: { data?: { appointments?: Appointment[] } }) =>
                response.data?.appointments ?? [],
            )


          return { data: { appointments: allAppointments } }
        } catch (error) {
          return { error }
        }
      },
    }),
    findAppointmentServiceById: builder.query<
      FindAppointmentById,
      { appointmentId: string }
    >({
      query: ({ appointmentId }) => ({
        url: API_VARIABLES.APPOINTMENTS_ENDPOINTS.FIND_APPOINTMENT_BY_ID(
          appointmentId,
        ),
        method: 'GET',
      }),
    }),
  }),
})
