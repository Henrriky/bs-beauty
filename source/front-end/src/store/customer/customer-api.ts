import { createApi } from '@reduxjs/toolkit/query/react'
import { Customer } from '../auth/types'
import { API_VARIABLES } from '../../api/config'
import { baseQueryWithAuth } from '../fetch-base/custom-fetch-base'

export const customerAPI = createApi({
  reducerPath: 'customer-api',
  baseQuery: baseQueryWithAuth,
  tagTypes: ['Customers'],
  endpoints: (builder) => ({
    fetchCustomers: builder.query<{ customers: Customer[] }, void>({
      query: () => ({
        url: API_VARIABLES.CUSTOMERS_ENDPOINTS.FETCH_CUSTOMERS,
        method: 'GET',
      }),
      providesTags: (result) =>
        result
          ? [
            ...result.customers.map(({ id }) => ({
              type: 'Customers' as const,
              id,
            })),
            { type: 'Customers', id: 'LIST' },
          ]
          : [{ type: 'Customers', id: 'LIST' }],
    }),
    getCustomerById: builder.query<Customer, string>({
      query: (customerId) => ({
        url: API_VARIABLES.CUSTOMERS_ENDPOINTS.FIND_CUSTOMER_BY_ID(customerId),
        method: 'GET',
      }),
      providesTags: (_result, _error, id) => [{ type: 'Customers', id }],
    }),
  }),
})
