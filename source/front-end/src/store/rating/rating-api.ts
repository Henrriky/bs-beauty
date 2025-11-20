import { createApi } from '@reduxjs/toolkit/query/react'
import { API_VARIABLES } from '../../api/config'
import { baseQueryWithAuth } from '../fetch-base/custom-fetch-base'
import { Rating, UpdateRating } from './types'
import { appointmentAPI } from '../appointment/appointment-api'

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
      { data: UpdateRating; id: string; appointmentId: string }
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
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled

          dispatch(
            appointmentAPI.util.invalidateTags([
              { type: 'Appointments', id: 'LIST' },
            ]),
          )
        } catch (error) {
          console.log(error)
        }
      },
    }),
  }),
})
