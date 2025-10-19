import { createApi } from '@reduxjs/toolkit/query/react'
import { baseQueryWithAuth } from '../fetch-base/custom-fetch-base'
import { API_VARIABLES } from '../../api/config'
import {
  DeleteBlockedTimeResponse,
  DeleteBlockedTimeRequest,
  CreateBlockedTimeRequest,
  UpdateBlockedTimeResponse,
  CreateBlockedTimeResponse,
  UpdateBlockedTimeRequest,
  GetBlockedTimesResponse,
  GetBlockedTimesRequest,
  GetBlockedTimeByIdResponse,
  GetBlockedTimeByIdRequest,
} from '../../pages/blocked-times/types'

export const blockedtimesAPI = createApi({
  reducerPath: 'blockedtimes-api',
  baseQuery: baseQueryWithAuth,
  tagTypes: ['BlockedTime'],
  endpoints: (builder) => ({
    getBlockedTimes: builder.query<
      GetBlockedTimesResponse,
      GetBlockedTimesRequest
    >({
      query: ({ page = 1, limit = 10, filters = {} }) => {
        const params = new URLSearchParams()
        params.append('page', String(page))
        params.append('limit', String(limit))

        if (filters.reason) params.append('reason', filters.reason)

        return {
          url: `${API_VARIABLES.BLOCKED_TIMES_ENDPOINTS.ENDPOINT}?${params.toString()}`,
          method: 'GET',
        }
      },
      providesTags: ['BlockedTime'],
    }),

    getBlockedTimeById: builder.query<
      GetBlockedTimeByIdResponse,
      GetBlockedTimeByIdRequest
    >({
      query: (id) => ({
        url: API_VARIABLES.BLOCKED_TIMES_ENDPOINTS.FIND_BY_ID(id),
        method: 'GET',
      }),
      providesTags: ['BlockedTime'],
    }),

    createBlockedTime: builder.mutation<
      CreateBlockedTimeResponse,
      CreateBlockedTimeRequest
    >({
      query: (data) => ({
        url: API_VARIABLES.BLOCKED_TIMES_ENDPOINTS.ENDPOINT,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['BlockedTime'],
    }),

    updateBlockedTime: builder.mutation<
      UpdateBlockedTimeResponse,
      UpdateBlockedTimeRequest
    >({
      query: ({ id, data }) => ({
        url: API_VARIABLES.BLOCKED_TIMES_ENDPOINTS.UPDATE_BLOCKED_TIME(id),
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['BlockedTime'],
    }),

    deleteBlockedTime: builder.mutation<
      DeleteBlockedTimeResponse,
      DeleteBlockedTimeRequest
    >({
      query: (id) => ({
        url: API_VARIABLES.BLOCKED_TIMES_ENDPOINTS.DELETE_BLOCKED_TIME(id),
        method: 'DELETE',
      }),
      invalidatesTags: ['BlockedTime'],
    }),
  }),
})

export const {
  useGetBlockedTimesQuery,
  useGetBlockedTimeByIdQuery,
  useCreateBlockedTimeMutation,
  useUpdateBlockedTimeMutation,
  useDeleteBlockedTimeMutation,
} = blockedtimesAPI
