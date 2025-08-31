import {
  CustomerCompleteRegisterFormData,
  ProfessionalCompleteRegisterFormData,
} from '../../pages/complete-register/types'
import { createApi } from '@reduxjs/toolkit/query/react'
import { baseQueryWithAuth } from '../fetch-base/custom-fetch-base'
import { API_VARIABLES } from '../../api/config'
import { Customer, Professional } from './types'

export const authAPI = createApi({
  reducerPath: 'auth-api',
  baseQuery: baseQueryWithAuth,
  tagTypes: ['User'],
  endpoints: (builder) => ({
    completeRegister: builder.mutation<
      { success: boolean },
      CustomerCompleteRegisterFormData | ProfessionalCompleteRegisterFormData
    >({
      query: (data) => ({
        url: API_VARIABLES.AUTH_ENDPOINTS.COMPLETE_REGISTER,
        method: 'POST',
        body: data,
      }),
    }),
    fetchUserInfo: builder.query<{ user: Professional | Customer }, void>({
      query: () => ({
        url: API_VARIABLES.AUTH_ENDPOINTS.FETCH_USER_INFO,
        method: 'GET',
      }),
      providesTags: ['User'],
    }),
  }),
})
