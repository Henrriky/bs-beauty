import { createApi } from '@reduxjs/toolkit/query/react'
import { baseQueryWithAuth } from '../fetch-base/custom-fetch-base'
import { API_VARIABLES } from '../../api/config'
import {
  Analytics,
  FetchAppointmentsCountParams,
  FetchAppointmentsCountResponse,
  FetchEstimatedTimeParams,
  FetchEstimatedTimeResponse,
  FetchCancelationRateParams,
  FetchCancelationRateResponse,
} from './types'

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
    fetchAnalyticsByProfessionalId: builder.query<
      Analytics,
      { professionalId: string }
    >({
      query: ({ professionalId }) => ({
        url: API_VARIABLES.ANALYTICS_ENDPOINTS.FETCH_ANALYTICS_BY_PROFESSIONAL(
          professionalId,
        ),
        method: 'GET',
      }),
    }),
    fetchAppointmentsCount: builder.query<
      FetchAppointmentsCountResponse,
      FetchAppointmentsCountParams
    >({
      query: (params) => ({
        url: API_VARIABLES.ANALYTICS_ENDPOINTS.FETCH_APPOINTMENTS_COUNT,
        method: 'POST',
        body: params,
      }),
    }),
    fetchEstimatedTime: builder.query<
      FetchEstimatedTimeResponse,
      FetchEstimatedTimeParams
    >({
      query: (params) => ({
        url: API_VARIABLES.ANALYTICS_ENDPOINTS.FETCH_ESTIMATED_TIME,
        method: 'POST',
        body: params,
      }),
    }),
    fetchCancelationRate: builder.query<
      FetchCancelationRateResponse,
      FetchCancelationRateParams
    >({
      query: (params) => ({
        url: API_VARIABLES.ANALYTICS_ENDPOINTS.FETCH_CANCELATION_RATE,
        method: 'POST',
        body: params,
      }),
    }),
  }),
})

export const {
  useFetchAnalyticsQuery,
  useFetchAnalyticsByProfessionalIdQuery,
  useFetchAppointmentsCountQuery,
  useFetchEstimatedTimeQuery,
  useFetchCancelationRateQuery,
} = analyticsAPI
