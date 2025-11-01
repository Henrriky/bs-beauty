import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithAuth } from "../fetch-base/custom-fetch-base";
import { API_VARIABLES } from "../../api/config";
import { FindAllNotificationsParams, MarkManyAsReadRequest, MarkManyAsReadResponse, PaginatedNotificationsResponse } from "./types";

export const notificationAPI = createApi({
  reducerPath: 'notification-api',
  baseQuery: baseQueryWithAuth,
  tagTypes: ['Notifications'],
  refetchOnFocus: true,
  refetchOnReconnect: true,
  endpoints: (builder) => ({
    fetchNotifications: builder.query<
      PaginatedNotificationsResponse,
      FindAllNotificationsParams | void
    >({
      query: (params: FindAllNotificationsParams) => ({
        url: API_VARIABLES.NOTIFICATIONS_ENDPOINTS.FETCH_NOTIFICATIONS,
        method: 'GET',
        params,
      }),
      providesTags: (result) =>
        result
          ? [
            ...result.data.map(({ id }) => ({
              type: 'Notifications' as const,
              id,
            })),
            { type: 'Notifications', id: 'LIST' },
          ]
          : [{ type: 'Notifications', id: 'LIST' }],
    }),

    markNotificationsRead: builder.mutation<
      MarkManyAsReadResponse,
      MarkManyAsReadRequest
    >({
      query: (body) => ({
        url: API_VARIABLES.NOTIFICATIONS_ENDPOINTS.MARK_MANY_AS_READ,
        method: 'PUT',
        body,
      }),
      invalidatesTags: [{ type: 'Notifications', id: 'LIST' }],
    }),
  })
})