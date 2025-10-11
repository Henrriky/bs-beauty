import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithAuth } from "../fetch-base/custom-fetch-base";
import { API_VARIABLES } from "../../api/config";
import {
  FindAllNotificationTemplatesParams,
  PaginatedNotificationTemplatesResponse,
  UpdateNotificationTemplateParams,
  UpdateNotificationTemplateResponse,
} from "./types";

export const notificationTemplateAPI = createApi({
  reducerPath: "notification-template-api",
  baseQuery: baseQueryWithAuth,
  tagTypes: ["NotificationTemplates"],
  refetchOnFocus: true,
  refetchOnReconnect: true,
  endpoints: (builder) => ({
    fetchNotificationTemplates: builder.query<
      PaginatedNotificationTemplatesResponse,
      FindAllNotificationTemplatesParams | void
    >({
      query: (params?: FindAllNotificationTemplatesParams) => ({
        url: API_VARIABLES.NOTIFICATION_TEMPLATES_ENDPOINTS.FETCH_NOTIFICATION_TEMPLATES,
        method: "GET",
        ...(params ? { params } : {}),
      }),
      providesTags: (result) =>
        result
          ? [
            ...result.data.map((item) => ({
              type: "NotificationTemplates" as const,
              id: item.id,
            })),
            { type: "NotificationTemplates", id: "LIST" },
          ]
          : [{ type: "NotificationTemplates", id: "LIST" }],
    }),
    updateNotificationTemplate: builder.mutation<
      UpdateNotificationTemplateResponse,
      UpdateNotificationTemplateParams
    >({
      query: ({ key, title, body }) => ({
        url: API_VARIABLES.NOTIFICATION_TEMPLATES_ENDPOINTS.UPDATE_NOTIFICATION_TEMPLATE(key),
        method: "PUT",
        body: { title, body },
      }),
      invalidatesTags: () => [{ type: "NotificationTemplates", id: "LIST" }],
    }),
  }),
});
