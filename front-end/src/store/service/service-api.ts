import { createApi } from '@reduxjs/toolkit/query/react'
import { API_VARIABLES } from '../../api/config'
import { CreateServiceFormData } from '../../pages/services/components/types'
import { baseQueryWithAuth } from '../fetch-base/custom-fetch-base'
import { EmployeesOfferingService, Service } from './types'

export const serviceAPI = createApi({
  reducerPath: 'services',
  baseQuery: baseQueryWithAuth,
  tagTypes: ['Services'],
  endpoints: (builder) => ({
    getServices: builder.query<{ services: Service[] }, void>({
      query: () => ({
        url: API_VARIABLES.SERVICES_ENDPOINTS.ENDPOINT,
        method: 'GET',
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.services.map(({ id }) => ({
                type: 'Services' as const,
                id,
              })),
              { type: 'Services', id: 'LIST' },
            ]
          : [{ type: 'Services', id: 'LIST' }],
    }),
    fetchEmployeesOfferingService: builder.query<
      { employeesOfferingService: EmployeesOfferingService },
      { serviceId: string }
    >({
      query: ({ serviceId }) => ({
        url: API_VARIABLES.SERVICES_ENDPOINTS.FETCH_EMPLOYEES_OFFERING_SERVICE(
          serviceId,
        ),
        method: 'GET',
      }),
    }),
    createService: builder.mutation<
      { success: boolean },
      CreateServiceFormData
    >({
      query: (data) => ({
        url: API_VARIABLES.SERVICES_ENDPOINTS.ENDPOINT,
        method: 'POST',
        body: data,
      }),
    }),
  }),
})
