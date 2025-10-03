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
  GetProfessionalRolesRequest,
  GetProfessionalRolesResponse,
  AddRoleToProfessionalRequest,
  AddRoleToProfessionalResponse,
  RemoveRoleFromProfessionalRequest,
  RemoveRoleFromProfessionalResponse,
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

    // Professional Roles Management
    fetchProfessionalRoles: builder.query<
      GetProfessionalRolesResponse,
      GetProfessionalRolesRequest
    >({
      query: ({ professionalId }) => ({
        url: API_VARIABLES.PROFESSIONALS_ENDPOINTS.FETCH_PROFESSIONAL_ROLES(
          professionalId,
        ),
        method: 'GET',
      }),
      providesTags: (_result, _error, { professionalId }) => [
        { type: 'Professionals', id: professionalId },
      ],
    }),

    addRoleToProfessional: builder.mutation<
      AddRoleToProfessionalResponse,
      AddRoleToProfessionalRequest
    >({
      query: ({ professionalId, data }) => ({
        url: API_VARIABLES.PROFESSIONALS_ENDPOINTS.ADD_ROLE_TO_PROFESSIONAL(
          professionalId,
        ),
        method: 'POST',
        body: data,
      }),
      invalidatesTags: (_result, _error, { professionalId }) => [
        { type: 'Professionals', id: professionalId },
        { type: 'Professionals', id: 'LIST' },
      ],
    }),

    removeRoleFromProfessional: builder.mutation<
      RemoveRoleFromProfessionalResponse,
      RemoveRoleFromProfessionalRequest
    >({
      query: ({ professionalId, data }) => ({
        url: API_VARIABLES.PROFESSIONALS_ENDPOINTS.REMOVE_ROLE_FROM_PROFESSIONAL(
          professionalId,
        ),
        body: data,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, { professionalId }) => [
        { type: 'Professionals', id: professionalId },
        { type: 'Professionals', id: 'LIST' },
      ],
    }),
  }),
})

export const {
  useFetchProfessionalsQuery,
  useInsertProfessionalMutation,
  useDeleteProfessionalMutation,
  useFetchServicesOfferedByProfessionalQuery,
  useFetchProfessionalRolesQuery,
  useAddRoleToProfessionalMutation,
  useRemoveRoleFromProfessionalMutation,
} = professionalAPI
