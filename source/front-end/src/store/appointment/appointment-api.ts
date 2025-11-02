/* eslint-disable @typescript-eslint/ban-ts-comment */
// TODO: Solve errors

import { createApi } from '@reduxjs/toolkit/query/react'
import { API_VARIABLES } from '../../api/config'
import {
  CustomerUpdateAppointmentFormData,
  ProfessionalUpdateAppointmentFormData,
} from '../../pages/appointments/types'
import { baseQueryWithAuth } from '../fetch-base/custom-fetch-base'
import {
  Appointment,
  CreateAppointmentAPIData,
  FindAllAppointmentsParams,
  FindAppointmentByCustomerId,
  FindAppointmentById,
  PaginatedAppointmentsResponse,
} from './types'

export const appointmentAPI = createApi({
  reducerPath: 'appointments',
  baseQuery: baseQueryWithAuth,
  tagTypes: ['Appointments'],
  endpoints: (builder) => ({
    fetchAppointments: builder.query<
      PaginatedAppointmentsResponse,
      FindAllAppointmentsParams | void
    >({
      async queryFn(params, _api, _extra, fetchWithBQ) {
        const MAX_LIMIT = 50;

        // o que o chamador pediu
        const requestedLimit = Math.max(1, Number(params?.limit ?? 20));
        const pageStart = Math.max(1, Number(params?.page ?? 1));

        // quanto pedir por requisição (capado no back)
        const perPage = Math.min(MAX_LIMIT, requestedLimit);

        const buildQS = (page: number, limit: number) => {
          const p = new URLSearchParams();
          p.set('page', String(page));
          p.set('limit', String(limit));
          if (params?.from) p.set('from', params.from);
          if (params?.to) p.set('to', params.to);
          if (params?.status?.length) p.set('status', params.status.join(','));
          if (typeof params?.viewAll === 'boolean') p.set('viewAll', String(params.viewAll));
          return p.toString();
        };

        let acc: PaginatedAppointmentsResponse['data'] = [];
        let page = pageStart;
        let total = 0;
        let lastPage = 1;

        while (true) {
          const qs = buildQS(page, perPage);
          const res = await fetchWithBQ({
            url: `${API_VARIABLES.APPOINTMENTS_ENDPOINTS.FETCH_USER_APPOINTMENTS}?${qs}`,
            method: 'GET',
          });

          if ('error' in res && res.error) return { error: res.error };

          const payload = res.data as PaginatedAppointmentsResponse;
          acc = acc.concat(payload.data);
          total = payload.total;
          lastPage = payload.totalPages ?? Math.ceil(total / payload.limit);

          // se o caller pediu mais que 50, vamos acumulando até atingir o pedido
          const enoughForCaller = requestedLimit > MAX_LIMIT
            ? acc.length >= requestedLimit
            : true;

          if (enoughForCaller || payload.page >= lastPage) break;
          page += 1;
        }

        // corta pro tamanho que o caller pediu (se pediu >50)
        const sliced = acc.slice(0, requestedLimit);

        return {
          data: {
            data: sliced,
            total,
            page: pageStart,
            limit: requestedLimit,
            totalPages: lastPage,
          } satisfies PaginatedAppointmentsResponse,
        };
      },

      providesTags: (result) =>
        result
          ? [
            ...result.data.map(({ id }) => ({ type: 'Appointments' as const, id })),
            { type: 'Appointments' as const, id: 'LIST' },
          ]
          : [{ type: 'Appointments' as const, id: 'LIST' }],

      keepUnusedDataFor: 30,
    }),
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
        | ProfessionalUpdateAppointmentFormData
      ) & { id: string }
    >({
      query: (data) => ({
        url: API_VARIABLES.APPOINTMENTS_ENDPOINTS.UPDATE_APPOINTMENT(data.id),
        method: 'PUT',
        body: {
          ...data,
          id: undefined,
        },
      }),
    }),
    finishAppointment: builder.mutation<
      void,
      ProfessionalUpdateAppointmentFormData & { id: string }
    >({
      query: (data) => ({
        url: API_VARIABLES.APPOINTMENTS_ENDPOINTS.FINISH_APPOINTMENT(data.id),
        method: 'PUT',
        body: {
          ...data,
          id: undefined,
        },
      }),
    }),
    findAppointmentsByCustomerOrProfessionalId: builder.query<
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
    fetchProfessionalAppointmentsByAllOffers: builder.query<
      { appointments: Appointment[] },
      string
    >({
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      async queryFn(userId, _queryApi, _extraOptions, fetchWithBQ) {
        try {
          const offersResponse = await fetchWithBQ({
            url: `/offers/professional/${userId}`,
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
            .filter((response: { data?: { appointments?: Appointment[] } }) =>
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
