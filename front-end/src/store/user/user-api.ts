import { createApi } from '@reduxjs/toolkit/query/react'
import { baseQueryWithAuth } from '../fetch-base/custom-fetch-base'
import {
  CustomerUpdateProfileFormData,
  EmployeeUpdateProfileFormData,
  ManagerUpdateProfileFormData,
} from '../../pages/profile/types'
import { API_VARIABLES } from '../../api/config'

export const userAPI = createApi({
  reducerPath: 'user-api',
  baseQuery: baseQueryWithAuth,
  endpoints: (builder) => ({
    updateProfile: builder.mutation<
      void,
      {
        userId: string
        profileData:
          | CustomerUpdateProfileFormData
          | EmployeeUpdateProfileFormData
          | ManagerUpdateProfileFormData
      }
    >({
      query: (data) => {
        let url = ''
        const isEmployeeProfileUpdate =
          'contact' in data.profileData || !('phone' in data.profileData)

        if (isEmployeeProfileUpdate) {
          url = `${API_VARIABLES.USER_ENDPOINTS.UPDATE_EMPLOYEE_PROFILE}/${data.userId}`
        } else {
          url = `${API_VARIABLES.USER_ENDPOINTS.UPDATE_CUSTOMER_PROFILE}/${data.userId}`
        }

        // TODO (IMPORTANT): Change this to pass dynamic
        // userId with token information on getState (state.auth.user.id)
        return {
          url,
          method: 'PUT',
          body: data.profileData,
        }
      },
    }),
  }),
})
