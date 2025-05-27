import { BaseQueryFn, FetchArgs, fetchBaseQuery, FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { API_VARIABLES } from "../../api/config";
import { RootState } from "../../hooks/use-app-selector";
import { ResponseWithErrorBody } from "./types";
import { AppErrorCodes } from "./errors/app-error-codes";

const baseQuery = fetchBaseQuery({
  baseUrl: API_VARIABLES.BASE_URL,
  prepareHeaders(headers, { getState }) {
    const token = (getState() as RootState).auth.token?.accessToken

    if (token) {
      headers.set('Authorization', `Bearer ${token}`)
    }

    return headers
  },
})

const baseQueryWithAuth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const result = await baseQuery(args, api, extraOptions)
  const isUnauthorizedCode = result.meta?.response?.status === 401
  if (result.error && isUnauthorizedCode) {
    switch (
      (result.error.data as ResponseWithErrorBody)?.errors
    ) {
      case AppErrorCodes.TOKEN_INVALID:
      case AppErrorCodes.ROLE_NON_EXISTENT:
        //TODO: Before call window.location.href toast error to give feedback to user and setTimeout
        //TODO: Create api.dispatch logoutUser to remove user informations and force logout from react provider      
        window.location.href = '/'
        break;
      case AppErrorCodes.ROLE_INSUFFICIENT:
        window.location.href = '/home'
        break;
    }
  }

  return result
}

export { baseQueryWithAuth }