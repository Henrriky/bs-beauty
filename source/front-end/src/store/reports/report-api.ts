import { createApi } from '@reduxjs/toolkit/query/react'
import { baseQueryWithAuth } from '../fetch-base/custom-fetch-base'
import { API_VARIABLES } from '../../api/config'
import {
  GetDiscoverySourceCountResponse,
  GetDiscoverySourceCountParams,
  GetCustomerAgeDistributionResponse,
  GetCustomerAgeDistributionParams,
  GetRevenueEvolutionResponse,
  GetRevenueEvolutionParams,
} from './types'

export const reportAPI = createApi({
  reducerPath: 'report-api',
  baseQuery: baseQueryWithAuth,
  tagTypes: ['Report'],
  endpoints: (builder) => ({
    getDiscoverySourceCount: builder.query<
      GetDiscoverySourceCountResponse,
      GetDiscoverySourceCountParams | void
    >({
      query: (params) => ({
        url: API_VARIABLES.REPORTS_ENDPOINTS.DISCOVERY_SOURCE_COUNT,
        method: 'GET',
        ...(params ? { params } : {}),
      }),
      providesTags: ['Report'],
    }),
    getCustomerAgeDistribution: builder.query<
      GetCustomerAgeDistributionResponse,
      GetCustomerAgeDistributionParams | void
    >({
      query: (params) => ({
        url: API_VARIABLES.REPORTS_ENDPOINTS.CUSTOMER_AGE_DISTRIBUTION,
        method: 'GET',
        ...(params ? { params } : {}),
      }),
      providesTags: ['Report'],
    }),
    getRevenueEvolution: builder.query<
      GetRevenueEvolutionResponse,
      GetRevenueEvolutionParams
    >({
      query: (params) => ({
        url: API_VARIABLES.REPORTS_ENDPOINTS.REVENUE_EVOLUTION,
        method: 'GET',
        params,
      }),
      providesTags: ['Report'],
    }),
  }),
})

export const {
  useGetDiscoverySourceCountQuery,
  useGetCustomerAgeDistributionQuery,
  useGetRevenueEvolutionQuery,
} = reportAPI
