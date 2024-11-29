import { isRejectedWithValue, Middleware, MiddlewareAPI } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

export const rtkQueryErrorLogger: Middleware = (api: MiddlewareAPI) => (next) => (action) => {
  if (isRejectedWithValue(action)) {
    console.debug('Rejected action on error middleware', action)
    toast.warn('Alguma coisa deu errado!')
  }

  return next(action);
}