import { createApi } from '@reduxjs/toolkit/query/react'
import { baseQueryWithAuth } from '../fetch-base/custom-fetch-base'
import {
  CreateOfferFormData,
  UpdateOfferFormData,
  // UpdateOfferFormData,
} from '../../pages/services/components/types'
import { API_VARIABLES } from '../../api/config'
import { AvailableSchedulling, Offer } from './types'

export const offerAPI = createApi({
  reducerPath: 'offers',
  baseQuery: baseQueryWithAuth,
  tagTypes: ['Offers'],
  endpoints: (builder) => ({
    getOffers: builder.query<{ offers: Offer[] }, string>({
      query: (employeeId) => ({
        url: `${API_VARIABLES.OFFERS_ENDPOINTS.ENDPOINT}/employee/${employeeId}`,
        method: 'GET',
      }),
      providesTags: ['Offers'],
    }),
    createOffer: builder.mutation<{ success: boolean }, CreateOfferFormData>({
      query: (data) => ({
        url: API_VARIABLES.OFFERS_ENDPOINTS.ENDPOINT,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Offers'],
    }),
    updateOffer: builder.mutation<
      { success: boolean },
      { data: UpdateOfferFormData; id: string }
    >({
      query: ({ id, data }) => ({
        url: `${API_VARIABLES.OFFERS_ENDPOINTS.ENDPOINT}/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Offers', id },
        { type: 'Offers' },
      ],
    }),
    deleteOffer: builder.mutation<{ success: boolean }, string>({
      query: (id) => ({
        url: `${API_VARIABLES.OFFERS_ENDPOINTS.ENDPOINT}/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Offers'],
    }),
    fetchForAvailableSchedulesFromEmployeeOffer: builder.query<
      { availableSchedulling: AvailableSchedulling[] },
      { serviceOfferedId: string; dayToFetchAvailableSchedulling: string }
    >({
      query: ({ serviceOfferedId, dayToFetchAvailableSchedulling }) => ({
        url: API_VARIABLES.OFFERS_ENDPOINTS.FETCH_FOR_AVAILABLE_SCHEDULES_FROM_EMPLOYEE_OFFER(
          serviceOfferedId,
          dayToFetchAvailableSchedulling,
        ),
        method: 'GET',
      }),
    }),
  }),
})
