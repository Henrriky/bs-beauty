import { createApi } from '@reduxjs/toolkit/query/react'
import { API_VARIABLES } from '../../api/config'
import { CreateServiceFormData } from '../../pages/services/components/types'
import { baseQueryWithAuth } from '../fetch-base/custom-fetch-base'
import { Service } from './types'

export const serviceAPI = createApi({
  reducerPath: 'services',
  baseQuery: baseQueryWithAuth,
  endpoints: (builder) => ({
    getServices: builder.query<{ services: Service[] }, void>({
      query: () => ({
        url: API_VARIABLES.SERVICES_ENDPOINTS.ENDPOINT,
        method: 'GET',
      }),
    }),
    createService: builder.mutation<
      { success: boolean },
      CreateServiceFormData
    >({
      query: (data) => ({
        url: API_VARIABLES.SERVICES_ENDPOINTS.ENDPOINT,
        method: 'POST',
        body: data,
      }),
    }),
  }),
})
