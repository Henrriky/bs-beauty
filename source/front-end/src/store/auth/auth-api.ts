import {
  CustomerCompleteRegisterFormData,
  EmployeeCompleteRegisterFormData,
} from '../../pages/complete-register/types'
import { createApi } from '@reduxjs/toolkit/query/react'
import { baseQueryWithAuth } from '../fetch-base/custom-fetch-base'
import { API_VARIABLES } from '../../api/config'
import { Customer, Employee } from './types'
import {
  CustomerRegistrationFormData,
  EmployeeRegistrationFormData,
} from '../../pages/user-registration/types'

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
        url: API_VARIABLES.AUTH_ENDPOINTS.REGISTER_USER,
        method: 'POST',
        body: data,
      }),
    }),
    registerEmployee: builder.mutation<
      { success: boolean },
      EmployeeRegistrationFormData
    >({
      query: (data) => ({
        url: API_VARIABLES.AUTH_ENDPOINTS.REGISTER_USER,
        method: 'PUT',
        body: data,
      }),
    }),
    findEmployeeByEmail: builder.query<Employee, string>({
      query: (email) => ({
        url: `${API_VARIABLES.AUTH_ENDPOINTS.REGISTER_USER}/${email}`,
        method: 'GET',
      }),
    }),
    validateCode: builder.mutation<
      { success: boolean },
      { purpose: string; email: string; code: string }
    >({
      query: (data) => ({
        url: API_VARIABLES.AUTH_ENDPOINTS.CODE_VALIDATION,
        method: 'POST',
        body: data,
      }),
    }),
  }),
})
