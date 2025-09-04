import {
  CustomerCompleteRegisterFormData,
  EmployeeCompleteRegisterFormData,
} from '../../pages/complete-register/types'
import { createApi } from '@reduxjs/toolkit/query/react'
import { baseQueryWithAuth } from '../fetch-base/custom-fetch-base'
import { API_VARIABLES } from '../../api/config'
import { Customer, Employee } from './types'
import { CustomerRegistrationFormData } from '../../pages/customer-registration/types'

export const authAPI = createApi({
  reducerPath: 'auth-api',
  baseQuery: baseQueryWithAuth,
  tagTypes: ['User'],
  endpoints: (builder) => ({
    completeRegister: builder.mutation<
      { success: boolean },
      CustomerCompleteRegisterFormData | EmployeeCompleteRegisterFormData
    >({
      query: (data) => ({
        url: API_VARIABLES.AUTH_ENDPOINTS.COMPLETE_REGISTER,
        method: 'POST',
        body: data,
      }),
    }),
    fetchUserInfo: builder.query<{ user: Employee | Customer }, void>({
      query: () => ({
        url: API_VARIABLES.AUTH_ENDPOINTS.FETCH_USER_INFO,
        method: 'GET',
      }),
      providesTags: ['User'],
    }),
    registerCustomer: builder.mutation<
      { success: boolean },
      CustomerRegistrationFormData
    >({
      query: (data) => ({
        url: API_VARIABLES.AUTH_ENDPOINTS.REGISTER_CUSTOMER,
        method: 'POST',
        body: data,
      }),
    }),
  }),
})
