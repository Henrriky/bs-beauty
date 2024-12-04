import {
  CustomerCompleteRegisterFormData,
  EmployeeCompleteRegisterFormData,
} from '../../pages/complete-register/components/types'
import { createApi } from '@reduxjs/toolkit/query/react'
import { baseQueryWithAuth } from '../fetch-base/custom-fetch-base'
import { API_VARIABLES } from '../../api/config'
import { Customer, Employee } from './types'

export const authAPI = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithAuth,
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
    }),
    updateProfile: builder.mutation<
      { success: boolean },
      EmployeeCompleteRegisterFormData | CustomerCompleteRegisterFormData
    >({
      query: (data) => ({
        url: API_VARIABLES.AUTH_ENDPOINTS.UPDATE_PROFILE,
        method: 'PUT',
        body: data,
      }),
    }),
  }),
})
