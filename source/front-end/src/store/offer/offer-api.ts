import { createApi } from '@reduxjs/toolkit/query/react'
import { API_VARIABLES } from '../../api/config'
import {
  CreateOfferFormData,
  UpdateOfferFormData,
} from '../../pages/services/components/types'
import { baseQueryWithAuth } from '../fetch-base/custom-fetch-base'
import { AvailableSchedulling, PaginatedOffersResponse } from './types'

export const offerAPI = createApi({
  reducerPath: 'offers',
  baseQuery: baseQueryWithAuth,
  tagTypes: ['Offers'],
  endpoints: (builder) => ({
    getOffers: builder.query<
      PaginatedOffersResponse,
      {
        professionalId: string
        page?: number
        limit?: number
      }
    >({
      query: ({ professionalId, page, limit }) => ({
        url: `${API_VARIABLES.OFFERS_ENDPOINTS.ENDPOINT}/professional/${professionalId}`,
        method: 'GET',
        params: {
          page,
          limit,
        },
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
    fetchForAvailableSchedulesFromProfessionalOffer: builder.query<
      { availableSchedulling: AvailableSchedulling[] },
      { serviceOfferedId: string; dayToFetchAvailableSchedulling: string }
    >({
      query: ({ serviceOfferedId, dayToFetchAvailableSchedulling }) => ({
        url: API_VARIABLES.OFFERS_ENDPOINTS.FETCH_FOR_AVAILABLE_SCHEDULES_FROM_PROFESSIONAL_OFFER(
          serviceOfferedId,
          dayToFetchAvailableSchedulling,
        ),
        method: 'GET',
      }),
    }),
  }),
})
