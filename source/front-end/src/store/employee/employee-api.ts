import { createApi } from '@reduxjs/toolkit/query/react'
import { API_VARIABLES } from '../../api/config'
import { Employee } from '../auth/types'
import { baseQueryWithAuth } from '../fetch-base/custom-fetch-base'
import { PaginatedEmployeesResponse, ServicesOfferedByEmployee } from './types'

export const employeeAPI = createApi({
  reducerPath: 'employee-api',
  baseQuery: baseQueryWithAuth,
  tagTypes: ['Employees'],
  endpoints: (builder) => ({
    fetchEmployees: builder.query<
      PaginatedEmployeesResponse,
      {
        page?: number
        limit?: number
        name?: string
        email?: string
      }
    >({
      query: (params) => ({
        url: API_VARIABLES.EMPLOYEES_ENDPOINTS.FETCH_EMPLOYEES,
        method: 'GET',
        params,
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({
                type: 'Employees' as const,
                id,
              })),
              { type: 'Employees', id: 'LIST' },
            ]
          : [{ type: 'Employees', id: 'LIST' }],
    }),
    insertEmployee: builder.mutation<Employee, { email: string }>({
      query: (data) => ({
        url: API_VARIABLES.EMPLOYEES_ENDPOINTS.CREATE_EMPLOYEE,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Employees'],
    }),
    deleteEmployee: builder.mutation<void, string>({
      query: (id) => ({
        url: API_VARIABLES.EMPLOYEES_ENDPOINTS.DELETE_EMPLOYEE(id),
        method: 'DELETE',
      }),
      invalidatesTags: ['Employees'],
    }),
    fetchServicesOfferedByEmployee: builder.query<
      { employee: ServicesOfferedByEmployee },
      { employeeId: string }
    >({
      query: ({ employeeId }) => ({
        url: API_VARIABLES.EMPLOYEES_ENDPOINTS.FETCH_SERVICES_OFFERED_BY_EMPLOYEE(
          employeeId,
        ),
        method: 'GET',
      }),
    }),
  }),
})
