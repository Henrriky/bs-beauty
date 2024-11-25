import {
  CustomerCompleteRegisterFormData,
  EmployeeCompleteRegisterFormData,
} from '../../pages/complete-register/components/types'
import { API_VARIABLES } from '../../api/config'
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const authAPI = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: API_VARIABLES.BASE_URL }),
  endpoints: (builder) => ({
    completeRegister: builder.mutation<
      { success: boolean },
      CustomerCompleteRegisterFormData | EmployeeCompleteRegisterFormData
    >({
      query: (data) => ({
        url: '/complete-register',
        method: 'POST',
        body: data,
      }),
    }),
  }),
})
