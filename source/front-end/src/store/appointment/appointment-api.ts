/* eslint-disable @typescript-eslint/ban-ts-comment */
// TODO: Solve errors

import { createApi } from '@reduxjs/toolkit/query/react'
import { baseQueryWithAuth } from '../fetch-base/custom-fetch-base'
import { API_VARIABLES } from '../../api/config'
import {
  Appointment,
  AppointmentService,
  AssociateAppointmentAPIData,
  CreateAppointmentAPIData,
  FindAppointmentServiceByCustomerId,
  FindAppointmentServiceById,
} from './types'
import {
  CustomerUpdateAppointmentFormData,
  EmployeeUpdateAppointmentFormData,
} from '../../pages/appointments/types'

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
        url: API_VARIABLES.APPOINTMENTS_ENDPOINTS.UPDATE_APPOINTMENT_SERVICE(
          data.id,
        ),
        method: 'PUT',
        body: {
          ...data,
          id: undefined,
        },
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
    findAppointmentsByCustomerOrEmployeeId: builder.query<
      {
        appointments: FindAppointmentServiceByCustomerId[]
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
      AppointmentService[],
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
      { appointments: AppointmentService[] },
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
            offersResponse.data?.offers.map((offer) => offer.id) || []

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
              (
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-expect-error
                response,
              ) => response.data,
            )
            .flatMap(
              (
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-expect-error
                response,
              ) => response.data.appointmentServices,
            )

          return { data: { appointments: allAppointments } }
        } catch (error) {
          return { error }
        }
      },
    }),
    findAppointmentServiceById: builder.query<
      FindAppointmentServiceById,
      { appointmentServiceId: string }
    >({
      query: ({ appointmentServiceId }) => ({
        url: API_VARIABLES.APPOINTMENTS_ENDPOINTS.FIND_APPOINTMENT_SERVICE_BY_ID(
          appointmentServiceId,
        ),
        method: 'GET',
      }),
    }),
  }),
})
