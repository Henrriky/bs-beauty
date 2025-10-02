import { createApi } from '@reduxjs/toolkit/query/react'
import { baseQueryWithAuth } from '../fetch-base/custom-fetch-base'
import { PaymentRecord } from './types'
import { API_VARIABLES } from '../../api/config'

export const paymentRecordAPI = createApi({
  reducerPath: 'payment-records',
  baseQuery: baseQueryWithAuth,
  tagTypes: ['PaymentRecords'],
  endpoints: (builder) => ({
    getPaymentRecordsByProfessionalId: builder.query<
      PaymentRecord[],
      { professionalId: string }
    >({
      query: ({ professionalId }) => ({
        url: API_VARIABLES.PAYMENT_RECORDS_ENDPONTS.FIND_BY_PROFESSIONAL_ID(
          professionalId,
        ),
        method: 'GET',
      }),
    }),
  }),
})
