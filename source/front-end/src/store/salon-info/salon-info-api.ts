import { createApi } from '@reduxjs/toolkit/query/react'
import { baseQueryWithAuth } from '../fetch-base/custom-fetch-base'
import { SalonInfoUpdateFormData } from '../../pages/salon-info/types'
import { API_VARIABLES } from '../../api/config'

export const salonInfoAPI = createApi({
  reducerPath: 'salon-settings',
  baseQuery: baseQueryWithAuth,
  tagTypes: ['SalonInfo'],
  endpoints: (builder) => ({
    updateSalonInfo: builder.mutation<
      { success: boolean },
      { data: SalonInfoUpdateFormData; id: number }
    >({
      query: ({ id, data }) => ({
        url: API_VARIABLES.SALON_INFO_ENDPOINTS.UPDATE_SALON_INFO(id),
        method: 'PUT',
        body: data,
      }),
    }),
  }),
})
