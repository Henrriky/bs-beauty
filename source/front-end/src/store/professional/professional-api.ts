import { createApi } from '@reduxjs/toolkit/query/react'
import { API_VARIABLES } from '../../api/config'
import { Professional } from '../auth/types'
import { baseQueryWithAuth } from '../fetch-base/custom-fetch-base'
import {
  PaginatedProfessionalsResponse,
  ServicesOfferedByProfessionalParams,
  ServicesOfferedByProfessionalResponse,
} from './types'

export const professionalAPI = createApi({
  reducerPath: 'professional-api',
  baseQuery: baseQueryWithAuth,
  tagTypes: ['Professionals'],
  endpoints: (builder) => ({
    fetchProfessionals: builder.query<
      PaginatedProfessionalsResponse,
      {
        page?: number
        limit?: number
        name?: string
        email?: string
      }
    >({
      query: (params) => ({
        url: API_VARIABLES.PROFESSIONALS_ENDPOINTS.FETCH_PROFESSIONALS,
        method: 'GET',
        params,
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({
                type: 'Professionals' as const,
                id,
              })),
              { type: 'Professionals', id: 'LIST' },
            ]
          : [{ type: 'Professionals', id: 'LIST' }],
    }),
    insertProfessional: builder.mutation<Professional, { email: string }>({
      query: (data) => ({
        url: API_VARIABLES.PROFESSIONALS_ENDPOINTS.CREATE_PROFESSIONAL,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Professionals'],
    }),
    deleteProfessional: builder.mutation<void, string>({
      query: (id) => ({
        url: API_VARIABLES.PROFESSIONALS_ENDPOINTS.DELETE_PROFESSIONAL(id),
        method: 'DELETE',
      }),
      invalidatesTags: ['Professionals'],
    }),
    fetchServicesOfferedByProfessional: builder.query<
      { professional: ServicesOfferedByProfessionalResponse },
      ServicesOfferedByProfessionalParams
    >({
      query: (params) => ({
        url: API_VARIABLES.PROFESSIONALS_ENDPOINTS.FETCH_SERVICES_OFFERED_BY_PROFESSIONAL(
          params.professionalId,
        ),
        method: 'GET',
        params: {
          ...params,
          professionalAPI: undefined,
        },
      }),
    }),
  }),
})
