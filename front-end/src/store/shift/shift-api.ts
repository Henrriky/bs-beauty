import { createApi } from '@reduxjs/toolkit/query/react'
import { baseQueryWithAuth } from '../fetch-base/custom-fetch-base'
import { API_VARIABLES } from '../../api/config'
import { FindShiftsByEmployeeResponse } from './types'

export const shiftAPI = createApi({
  reducerPath: 'shifts',
  baseQuery: baseQueryWithAuth,
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
  }),
})
