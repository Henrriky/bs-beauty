import { createApi } from '@reduxjs/toolkit/query/react'
import { baseQueryWithAuth } from '../fetch-base/custom-fetch-base'
import { API_VARIABLES } from '../../api/config'
import {
  Appointment,
  AppointmentService,
  AssociateAppointmentAPIData,
  CreateAppointmentAPIData,
  FindAppointmentServiceByCustomerId,
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
    findAppointmentsByCustomerId: builder.query<
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
      AppointmentService[],
      string
    >({
      async queryFn(userId, _queryApi, _extraOptions, fetchWithBQ) {
        try {
          const offersResponse = await fetchWithBQ({
            url: `/offers/employee/${userId}`,
          })
          const serviceOfferedIds =
            offersResponse.data?.offers.map((offer) => offer.id) || []

          const appointmentPromises = serviceOfferedIds.map((id) =>
            fetchWithBQ({
              url: API_VARIABLES.APPOINTMENTS_ENDPOINTS.FIND_BY_SERVICE_OFFERED(id),
            }),
          )

          const appointmentResponses = await Promise.all(appointmentPromises)

          const allAppointments = appointmentResponses
            .filter((response) => response.data)
            .flatMap((response) => response.data.appointmentServices)

          return { data: { appointments: allAppointments } }
        } catch (error) {
          return { error }
        }
      },
    }),
  }),
})
