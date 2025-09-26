import { createApi } from '@reduxjs/toolkit/query/react'
import { API_VARIABLES } from '../../api/config'
import { baseQueryWithAuth } from '../fetch-base/custom-fetch-base'
import { Rating } from './types'

export const ratingAPI = createApi({
  reducerPath: 'ratings',
  baseQuery: baseQueryWithAuth,
  tagTypes: ['Ratings'],
  endpoints: (builder) => ({
    getRatingById: builder.query<Rating, string>({
      query: (id) => ({
        url: `${API_VARIABLES.RATINGS_ENDPOINTS.FIND_BY_RATING_ID(id)}`,
        method: 'GET',
      }),
      providesTags: (_result, _error, id) => [{ type: 'Ratings', id }],
    }),
    updateRating: builder.mutation<
      { success: boolean },
      { data: Rating; id: string }
    >({
      query: ({ id, data }) => ({
        url: `${API_VARIABLES.RATINGS_ENDPOINTS.UPDATE_RATING(id)}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Ratings', id },
        { type: 'Ratings' },
      ],
    }),
  }),
})
