import { createApi } from '@reduxjs/toolkit/query/react'
import { baseQueryWithAuth } from '../fetch-base/custom-fetch-base'
import { API_VARIABLES } from '../../api/config'
import {
  GetDiscoverySourceCountResponse,
  GetDiscoverySourceCountParams,
  GetCustomerAgeDistributionResponse,
  GetCustomerAgeDistributionParams,
  GetNewCustomersCountResponse,
  GetNewCustomersCountParams,
  GetRevenueEvolutionResponse,
  GetRevenueEvolutionParams,
  GetTotalRevenueResponse,
  GetTotalRevenueParams,
  GetRevenueByServiceResponse,
  GetRevenueByServiceParams,
  GetRevenueByProfessionalResponse,
  GetRevenueByProfessionalParams,
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
    getNewCustomersCount: builder.query<
      GetNewCustomersCountResponse,
      GetNewCustomersCountParams
    >({
      query: (params) => ({
        url: API_VARIABLES.REPORTS_ENDPOINTS.NEW_CUSTOMERS_COUNT,
        method: 'GET',
        params,
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
    getTotalRevenue: builder.query<
      GetTotalRevenueResponse,
      GetTotalRevenueParams
    >({
      query: (params) => ({
        url: API_VARIABLES.REPORTS_ENDPOINTS.TOTAL_REVENUE,
        method: 'GET',
        params,
      }),
      providesTags: ['Report'],
    }),
    getRevenueByService: builder.query<
      GetRevenueByServiceResponse,
      GetRevenueByServiceParams
    >({
      query: (params) => ({
        url: API_VARIABLES.REPORTS_ENDPOINTS.REVENUE_BY_SERVICE,
        method: 'GET',
        params,
      }),
      providesTags: ['Report'],
    }),
    getRevenueByProfessional: builder.query<
      GetRevenueByProfessionalResponse,
      GetRevenueByProfessionalParams
    >({
      query: (params) => ({
        url: API_VARIABLES.REPORTS_ENDPOINTS.REVENUE_BY_PROFESSIONAL,
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
  useGetNewCustomersCountQuery,
  useGetRevenueEvolutionQuery,
  useGetTotalRevenueQuery,
  useGetRevenueByServiceQuery,
  useGetRevenueByProfessionalQuery,
} = reportAPI
