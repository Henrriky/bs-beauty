import { createApi } from '@reduxjs/toolkit/query/react'
import { baseQueryWithAuth } from '../fetch-base/custom-fetch-base'
import { API_VARIABLES } from '../../api/config'
import { FindShiftsByEmployeeResponse } from './types'
import { Shift } from '../auth/types'

export const shiftAPI = createApi({
  reducerPath: 'shifts',
  baseQuery: baseQueryWithAuth,
  tagTypes: ['Shifts'],
  endpoints: (builder) => ({
    findShiftsByEmployee: builder.query<
      { shifts: FindShiftsByEmployeeResponse },
      { employeeId: string }
    >({
      query: ({ employeeId }) => ({
        url: API_VARIABLES.SHIFTS_ENDPOINTS.FIND_SHIFTS_BY_EMPLOYEE(employeeId),
        method: 'GET',
      }),
    }),
    findShiftsByAuthenticatedUser: builder.query<{ shifts: Shift[] }, void>({
      query: () => ({
        url: API_VARIABLES.SHIFTS_ENDPOINTS.ENDPOINT,
        method: 'GET',
      }),
      providesTags: ['Shifts'],
    }),
    createShift: builder.mutation<
      void,
      {
        weekDay: string
        shiftStart: string
        shiftEnd: string
        isBusy: boolean
      }
    >({
      query: (data) => ({
        url: API_VARIABLES.SHIFTS_ENDPOINTS.ENDPOINT,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Shifts'],
    }),
    updateShift: builder.mutation<
      void,
      {
        id: string
        shiftStart: string
        shiftEnd: string
        isBusy: boolean
      }
    >({
      query: ({ id, ...data }) => ({
        url: API_VARIABLES.SHIFTS_ENDPOINTS.UPDATE_SHIFT(id),
        method: 'PUT',
        body: data,
      }),
    }),
  }),
})
