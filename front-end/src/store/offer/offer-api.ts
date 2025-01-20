import { createApi } from '@reduxjs/toolkit/query/react'
import { baseQueryWithAuth } from '../fetch-base/custom-fetch-base'
import { CreateOfferFormData } from '../../pages/services/components/types'
import { API_VARIABLES } from '../../api/config'

export const offerAPI = createApi({
  reducerPath: 'offers',
  baseQuery: baseQueryWithAuth,
  endpoints: (builder) => ({
    createOffer: builder.mutation<{ success: boolean }, CreateOfferFormData>({
      query: (data) => ({
        url: API_VARIABLES.OFFERS_ENDPOINTS.ENDPOINT,
        method: 'POST',
        body: data,
      }),
    }),
    fetchForAvailableSchedulesFromEmployeeOffer: builder.query<
      { offer: string },
      { serviceOfferedId: string; dayToFetchAvailableSchedulling: string }
    >({
      query: ({ serviceOfferedId, dayToFetchAvailableSchedulling }) => ({
        url: API_VARIABLES.OFFERS_ENDPOINTS.FETCH_FOR_AVAILABLE_SCHEDULES_FROM_EMPLOYEE_OFFER(
          serviceOfferedId,
        ),
        method: 'GET',
        body: {
          dayToFetchAvailableSchedulling,
        },
      }),
    }),
  }),
})
