import { createApi } from '@reduxjs/toolkit/query/react'
import { API_VARIABLES } from '../../api/config'
import {
  CreateServiceFormData,
  UpdateServiceFormData,
  // UpdateServiceFormData,
} from '../../pages/services/components/types'
import { baseQueryWithAuth } from '../fetch-base/custom-fetch-base'
import {
  ProfessionalsOfferingService,
  PaginatedServicesResponse,
  Service,
} from './types'

export const serviceAPI = createApi({
  reducerPath: 'services',
  baseQuery: baseQueryWithAuth,
  tagTypes: ['Services'],
  endpoints: (builder) => ({
    getServices: builder.query<
      PaginatedServicesResponse,
      {
        page?: number
        limit?: number
        name?: string
      }
    >({
      query: (params) => ({
        url: API_VARIABLES.SERVICES_ENDPOINTS.ENDPOINT,
        method: 'GET',
        params,
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({
                type: 'Services' as const,
                id,
              })),
              { type: 'Services', id: 'LIST' },
            ]
          : [{ type: 'Services', id: 'LIST' }],
    }),
    fetchProfessionalsOfferingService: builder.query<
      { professionalsOfferingService: ProfessionalsOfferingService },
      { serviceId: string }
    >({
      query: ({ serviceId }) => ({
        url: API_VARIABLES.SERVICES_ENDPOINTS.FETCH_PROFESSIONALS_OFFERING_SERVICE(
          serviceId,
        ),
        method: 'GET',
      }),
    }),
    getServiceById: builder.query<Service, string>({
      query: (serviceId) => ({
        url: `${API_VARIABLES.SERVICES_ENDPOINTS.ENDPOINT}/${serviceId}`,
        method: 'GET',
      }),
      providesTags: (_result, _error, id) => [{ type: 'Services', id }],
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
      invalidatesTags: ['Services'],
    }),
    updateService: builder.mutation<
      { success: boolean },
      { data: UpdateServiceFormData; id: string }
    >({
      query: ({ id, data }) => ({
        url: `${API_VARIABLES.SERVICES_ENDPOINTS.ENDPOINT}/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Services', id },
        { type: 'Services' },
      ],
    }),
    deleteService: builder.mutation<{ success: boolean }, string>({
      query: (id) => ({
        url: `${API_VARIABLES.SERVICES_ENDPOINTS.ENDPOINT}/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Services'],
    }),
  }),
})
