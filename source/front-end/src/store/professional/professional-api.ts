import { createApi } from '@reduxjs/toolkit/query/react'
import { API_VARIABLES } from '../../api/config'
import { baseQueryWithAuth } from '../fetch-base/custom-fetch-base'
import {
  ServicesOfferedByProfessionalParams,
  ServicesOfferedByProfessionalResponse,
} from './types'
import {
  CreateProfessionalRequest,
  CreateProfessionalResponse,
  GetProfessionalsRequest,
  GetProfessionalsResponse,
} from '../../pages/professionals/types'

export const professionalAPI = createApi({
  reducerPath: 'professional-api',
  baseQuery: baseQueryWithAuth,
  tagTypes: ['Professionals'],
  endpoints: (builder) => ({
    fetchProfessionals: builder.query<
      GetProfessionalsResponse,
      GetProfessionalsRequest
    >({
      query: ({ page, limit, filters = {} }) => {
        const params = new URLSearchParams()
        params.append('page', String(page))
        params.append('limit', String(limit))

        if (filters.email) params.append('email', filters.email)

        return {
          url: API_VARIABLES.PROFESSIONALS_ENDPOINTS.FETCH_PROFESSIONALS,
          method: 'GET',
          params,
        }
      },
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
    insertProfessional: builder.mutation<
      CreateProfessionalResponse,
      CreateProfessionalRequest
    >({
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

export const {
  useFetchProfessionalsQuery,
  useInsertProfessionalMutation,
  useDeleteProfessionalMutation,
  useFetchServicesOfferedByProfessionalQuery,
} = professionalAPI
