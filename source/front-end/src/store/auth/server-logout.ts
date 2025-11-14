import { createAsyncThunk } from '@reduxjs/toolkit'
import { API_VARIABLES } from '../../api/config'
import { logout } from './auth-slice'
import { authAPI } from './auth-api'
import { userAPI } from '../user/user-api'
import { serviceAPI } from '../service/service-api'
import { customerAPI } from '../customer/customer-api'
import { offerAPI } from '../offer/offer-api'
import { shiftAPI } from '../shift/shift-api'
import { professionalAPI } from '../professional/professional-api'
import { appointmentAPI } from '../appointment/appointment-api'
import { analyticsAPI } from '../analytics/analytics-api'
import { publicAnalyticsApi } from '../analytics/public-analytics-api'
import { notificationAPI } from '../notification/notification-api'
import { notificationTemplateAPI } from '../notification-template/notification-template-api'
import { ratingAPI } from '../rating/rating-api'
import { roleAPI } from '../role/role-api'
import { permissionAPI } from '../permission/permission-api'
import { blockedtimesAPI } from '../blocked-times/blocked-times-api'

export const serverLogout = createAsyncThunk(
  'auth/serverLogout',
  async (_, { dispatch }) => {
    try {
      await fetch(
        `${API_VARIABLES.BASE_URL}${API_VARIABLES.AUTH_ENDPOINTS.LOGOUT}`,
        { method: 'POST', credentials: 'include' },
      )
    } catch (e) {
      console.warn('[LOGOUT] Error trying to logout:', (e as Error)?.message)
    } finally {
      dispatch(logout())
      dispatch(authAPI.util.resetApiState())
      dispatch(userAPI.util.resetApiState())
      dispatch(serviceAPI.util.resetApiState())
      dispatch(customerAPI.util.resetApiState())
      dispatch(offerAPI.util.resetApiState())
      dispatch(shiftAPI.util.resetApiState())
      dispatch(professionalAPI.util.resetApiState())
      dispatch(appointmentAPI.util.resetApiState())
      dispatch(analyticsAPI.util.resetApiState())
      dispatch(publicAnalyticsApi.util.resetApiState())
      dispatch(notificationAPI.util.resetApiState())
      dispatch(notificationTemplateAPI.util.resetApiState())
      dispatch(ratingAPI.util.resetApiState())
      dispatch(roleAPI.util.resetApiState())
      dispatch(permissionAPI.util.resetApiState())
      dispatch(blockedtimesAPI.util.resetApiState())
    }
  },
)
