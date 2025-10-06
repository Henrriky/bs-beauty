import { createApi } from '@reduxjs/toolkit/query/react'
import { baseQueryWithAuth } from '../fetch-base/custom-fetch-base'
import { PaymentRecord } from './types'
import { API_VARIABLES } from '../../api/config'
import { CreatePaymentRecordFormData } from '../../pages/payments/types/types'

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
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({
                type: 'PaymentRecords' as const,
                id,
              })),
              { type: 'PaymentRecords', id: 'LIST' },
            ]
          : [{ type: 'PaymentRecords', id: 'LIST' }],
    }),
    createPaymentRecord: builder.mutation<
      { success: boolean },
      CreatePaymentRecordFormData
    >({
      query: (data) => ({
        url: API_VARIABLES.PAYMENT_RECORDS_ENDPONTS.CREATE_PAYMENT_RECORD,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['PaymentRecords'],
    }),
  }),
})
