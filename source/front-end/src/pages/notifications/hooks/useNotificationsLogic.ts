import { notificationAPI } from "../../../store/notification/notification-api";

export type Params = {
  page?: number
  limit?: number
  readStatus?: 'ALL' | 'READ' | 'UNREAD'
}

export function useNotificationsLogic(params?: Params) {

  const { data, isLoading, isError, isFetching } =
    notificationAPI.useFetchNotificationsQuery(params ?? {}, {
      skip: !params
    })

  const [markRead, { isLoading: isMarking }] =
    notificationAPI.useMarkNotificationsReadMutation()

  const [deleteNotifications, { isLoading: isDeleting }] = notificationAPI.useDeleteNotificationsMutation()

  return {
    data,
    isLoading,
    isError,
    isFetching,

    markRead,
    isMarking,

    deleteNotifications,
    isDeleting,
  }
}