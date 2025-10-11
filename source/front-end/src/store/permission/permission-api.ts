import { createApi } from '@reduxjs/toolkit/query/react'
import { baseQueryWithAuth } from '../fetch-base/custom-fetch-base'
import { API_VARIABLES } from '../../api/config'
import {
  GetPermissionsRequest,
  GetPermissionsResponse,
} from '../../pages/roles/types'

export const permissionAPI = createApi({
  reducerPath: 'permission-api',
  baseQuery: baseQueryWithAuth,
  tagTypes: ['Permission'],
  endpoints: (builder) => ({
    getPermissions: builder.query<
      GetPermissionsResponse,
      GetPermissionsRequest
    >({
      query: ({ page = 1, limit = 10, filters = {} }) => {
        const params = new URLSearchParams()
        params.append('page', String(page))
        params.append('limit', String(limit))

        if (filters.resource) params.append('resource', filters.resource)
        if (filters.action) params.append('action', filters.action)
        if (filters.search) params.append('search', filters.search)

        return {
          url: `${API_VARIABLES.PERMISSIONS_ENDPOINTS.ENDPOINT}?${params.toString()}`,
          method: 'GET',
        }
      },
      providesTags: ['Permission'],
    }),
  }),
})

export const { useGetPermissionsQuery } = permissionAPI
