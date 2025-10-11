import {
  CustomerCompleteRegisterFormData,
  ProfessionalCompleteRegisterFormData,
} from '../../pages/complete-register/types'
import { createApi } from '@reduxjs/toolkit/query/react'
import { baseQueryWithAuth } from '../fetch-base/custom-fetch-base'
import { API_VARIABLES } from '../../api/config'
import {
  FetchUserInfoRequest,
  FetchUserInfoResponse,
  Professional,
} from './types'
import {
  CustomerRegistrationFormData,
  ProfessionalRegistrationFormData,
} from '../../pages/user-registration/types'

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
      invalidatesTags: ['User'],
    }),
    fetchUserInfo: builder.query<FetchUserInfoResponse, FetchUserInfoRequest>({
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
    registerProfessional: builder.mutation<
      { success: boolean },
      ProfessionalRegistrationFormData
    >({
      query: (data) => ({
        url: API_VARIABLES.AUTH_ENDPOINTS.REGISTER_USER,
        method: 'PUT',
        body: data,
      }),
    }),
    findProfessionalByEmail: builder.query<Professional, string>({
      query: (email) => ({
        url: `${API_VARIABLES.AUTH_ENDPOINTS.REGISTER_USER}/${email}`,
        method: 'GET',
      }),
    }),
    validateCode: builder.mutation<
      { success: boolean; ticket?: string },
      { purpose: string; email: string; code: string }
    >({
      query: (data) => ({
        url: API_VARIABLES.AUTH_ENDPOINTS.CODE_VALIDATION,
        method: 'POST',
        body: data,
      }),
    }),
    requestPasswordReset: builder.mutation<
      { success: boolean },
      { email: string }
    >({
      query: (data) => ({
        url: API_VARIABLES.AUTH_ENDPOINTS.REQUEST_PASSWORD_RESET,
        method: 'POST',
        body: data,
      }),
    }),
    resetPassword: builder.mutation<
      { success: boolean },
      {
        ticket: string | undefined
        newPassword: string
        confirmNewPassword: string
      }
    >({
      query: (data) => ({
        url: API_VARIABLES.AUTH_ENDPOINTS.SET_NEW_PASSWORD,
        method: 'POST',
        body: data,
      }),
    }),
  }),
})
