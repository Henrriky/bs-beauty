import { createApi } from '@reduxjs/toolkit/query/react';
import { API_VARIABLES } from '../../api/config';
import { Employee } from '../auth/types';
import { baseQueryWithAuth } from '../fetch-base/custom-fetch-base';

export const employeeAPI = createApi({
  reducerPath: 'employee-api',
  baseQuery: baseQueryWithAuth,
  tagTypes: ['Employees'],
  endpoints: (builder) => ({
    fetchEmployees: builder.query<{ employees: Employee[] }, void>({
      query: () => ({
        url: API_VARIABLES.EMPLOYEES_ENDPOINTS.FETCH_EMPLOYEES,
        method: 'GET',
      }),
      providesTags: (result) =>
        result
          ? [
            ...result.employees.map(({ id }) => ({
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
  }),
});
