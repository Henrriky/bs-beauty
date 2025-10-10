import { createApi } from '@reduxjs/toolkit/query/react'
import { baseQueryNoAuth } from '../fetch-base/custom-fetch-base'
import { API_VARIABLES } from '../../api/config'
import { RatingAnalytics } from './types'

export const publicAnalyticsApi = createApi({
  reducerPath: 'publicAnalytics',
  baseQuery: baseQueryNoAuth,
  endpoints: (builder) => ({
    fetchRatingsAnalytics: builder.query<RatingAnalytics, void>({
      query: () => ({
        url: API_VARIABLES.ANALYTICS_ENDPOINTS.FETCH_RATINGS_ANALYTICS,
        method: 'GET',
      }),
    }),
  }),
})

export const { useFetchRatingsAnalyticsQuery } = publicAnalyticsApi
