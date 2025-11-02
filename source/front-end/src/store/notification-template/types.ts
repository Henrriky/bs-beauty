export interface NotificationTemplate {
  id: string;
  key: string;
  name: string;
  description: string;
  title: string;
  body: string;
  isActive: boolean;
  variables: string[];
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedNotificationTemplatesResponse {
  data: NotificationTemplate[];
  total: number;
  page: number;
  totalPages: number;
  limit: number;
}

export interface FindAllNotificationTemplatesParams {
  page?: number
  limit?: number
}

export interface UpdateNotificationTemplateParams {
  key: string;
  title: string;
  body: string;
}

export interface UpdateNotificationTemplateResponse {
  data: NotificationTemplate;
  message: string;
}