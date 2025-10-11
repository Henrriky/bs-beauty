import { createApi } from '@reduxjs/toolkit/query/react'
import { baseQueryWithAuth } from '../fetch-base/custom-fetch-base'
import { PaginatedPaymentRecordResponse, PaymentRecord } from './types'
import { API_VARIABLES } from '../../api/config'
import {
  CreatePaymentRecordFormData,
  UpdatePaymentRecordFormData,
} from '../../pages/payments/types/types'

export const paymentRecordAPI = createApi({
  reducerPath: 'payment-records',
  baseQuery: baseQueryWithAuth,
  tagTypes: ['PaymentRecords'],
  endpoints: (builder) => ({
    getPaymentRecordById: builder.query<PaymentRecord, string>({
      query: (paymentRecordId) => ({
        url: API_VARIABLES.PAYMENT_RECORDS_ENDPONTS.FIND_BY_ID(paymentRecordId),
        method: 'GET',
      }),
      providesTags: (_result, _error, id) => [{ type: 'PaymentRecords', id }],
    }),
    getPaymentRecordsByProfessionalId: builder.query<
      PaginatedPaymentRecordResponse,
      {
        professionalId: string
        page?: number
        limit?: number
      }
    >({
      query: ({ professionalId, page, limit }) => ({
        url: API_VARIABLES.PAYMENT_RECORDS_ENDPONTS.FIND_BY_PROFESSIONAL_ID(
          professionalId,
        ),
        method: 'GET',
        params: {
          page,
          limit,
        },
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({
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
    updatePaymentRecord: builder.mutation<
      { success: boolean },
      { id: string; data: UpdatePaymentRecordFormData }
    >({
      query: ({ id, data }) => ({
        url: API_VARIABLES.PAYMENT_RECORDS_ENDPONTS.UPDATE_PAYMENT_RECORD(id),
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['PaymentRecords'],
    }),
    deletePaymentRecord: builder.mutation<{ success: boolean }, string>({
      query: (id) => ({
        url: API_VARIABLES.PAYMENT_RECORDS_ENDPONTS.DELETE_PAYMENT_RECORD(id),
        method: 'DELETE',
      }),
      invalidatesTags: ['PaymentRecords'],
    }),
  }),
})
