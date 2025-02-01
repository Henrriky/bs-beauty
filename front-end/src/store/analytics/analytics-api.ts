import { createApi } from '@reduxjs/toolkit/query/react'
import { baseQueryWithAuth } from '../fetch-base/custom-fetch-base'
import { API_VARIABLES } from '../../api/config'
import { Analytics } from './types'

export const analyticsAPI = createApi({
  reducerPath: 'analytics',
  baseQuery: baseQueryWithAuth,
  tagTypes: ['Analytics'],
  endpoints: (builder) => ({
    fetchAnalytics: builder.query<Analytics, void>({
      query: () => ({
        url: API_VARIABLES.ANALYTICS_ENDPOINTS.FETCH_ANALYTICS,
        method: 'GET',
      }),
    }),
    fetchAnalyticsByEmployeeId: builder.query<
      Analytics,
      { employeeId: string }
    >({
      query: ({ employeeId }) => ({
        url: API_VARIABLES.ANALYTICS_ENDPOINTS.FETCH_ANALYTICS_BY_EMPLOYEE(
          employeeId,
        ),
        method: 'GET',
      }),
    }),
  }),
})
