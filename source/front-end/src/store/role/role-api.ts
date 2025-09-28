import { createApi } from '@reduxjs/toolkit/query/react'
import { baseQueryWithAuth } from '../fetch-base/custom-fetch-base'
import { API_VARIABLES } from '../../api/config'
import {
  DeleteRoleResponse,
  DeleteRoleRequest,
  CreateRoleRequest,
  UpdateRoleResponse,
  CreateRoleResponse,
  UpdateRoleRequest,
  GetRolesResponse,
  GetRolesRequest,
  GetRoleByIdResponse,
  GetRoleAssociationsResponse,
  GetRoleAssociationsRequest,
  GetRoleByIdRequest,
  RemovePermissionFromRoleResponse,
  RemovePermissionFromRoleRequest,
  AddPermissionToRoleRequest,
  AddPermissionToRoleResponse,
} from '../../pages/roles/types'

export const roleAPI = createApi({
  reducerPath: 'role-api',
  baseQuery: baseQueryWithAuth,
  tagTypes: ['Role'],
  endpoints: (builder) => ({
    getRoles: builder.query<GetRolesResponse, GetRolesRequest>({
      query: ({ page = 1, limit = 10, filters = {} }) => {
        const params = new URLSearchParams()
        params.append('page', String(page))
        params.append('limit', String(limit))

        if (filters.name) params.append('name', filters.name)

        return {
          url: `${API_VARIABLES.ROLES_ENDPOINTS.ENDPOINT}?${params.toString()}`,
          method: 'GET',
        }
      },
      providesTags: ['Role'],
    }),

    getRoleById: builder.query<GetRoleByIdResponse, GetRoleByIdRequest>({
      query: (id) => ({
        url: API_VARIABLES.ROLES_ENDPOINTS.FIND_BY_ID(id),
        method: 'GET',
      }),
      providesTags: ['Role'],
    }),

    createRole: builder.mutation<CreateRoleResponse, CreateRoleRequest>({
      query: (data) => ({
        url: API_VARIABLES.ROLES_ENDPOINTS.ENDPOINT,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Role'],
    }),

    updateRole: builder.mutation<UpdateRoleResponse, UpdateRoleRequest>({
      query: ({ id, data }) => ({
        url: API_VARIABLES.ROLES_ENDPOINTS.UPDATE_ROLE(id),
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Role'],
    }),

    deleteRole: builder.mutation<DeleteRoleResponse, DeleteRoleRequest>({
      query: (id) => ({
        url: API_VARIABLES.ROLES_ENDPOINTS.DELETE_ROLE(id),
        method: 'DELETE',
      }),
      invalidatesTags: ['Role'],
    }),

    getRoleAssociations: builder.query<
      GetRoleAssociationsResponse,
      GetRoleAssociationsRequest
    >({
      query: ({ id, page = 1, limit = 10, filters = {} }) => {
        const params = new URLSearchParams()
        params.append('page', String(page))
        params.append('limit', String(limit))

        if (filters.type) params.append('type', filters.type)

        return {
          url: `${API_VARIABLES.ROLES_ENDPOINTS.ASSOCIATIONS(id)}?${params.toString()}`,
          method: 'GET',
        }
      },
      providesTags: ['Role'],
    }),

    // Adicionar permissão à role
    addPermissionToRole: builder.mutation<
      AddPermissionToRoleResponse,
      AddPermissionToRoleRequest
    >({
      query: ({ roleId, data }) => ({
        url: API_VARIABLES.ROLES_ENDPOINTS.ADD_PERMISSION(roleId),
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Role'],
    }),

    // Remover permissão da role
    removePermissionFromRole: builder.mutation<
      RemovePermissionFromRoleResponse,
      RemovePermissionFromRoleRequest
    >({
      query: ({ roleId, data }) => ({
        url: API_VARIABLES.ROLES_ENDPOINTS.REMOVE_PERMISSION(roleId),
        method: 'DELETE',
        body: data,
      }),
      invalidatesTags: ['Role'],
    }),
  }),
})

export const {
  useGetRolesQuery,
  useGetRoleByIdQuery,
  useCreateRoleMutation,
  useUpdateRoleMutation,
  useDeleteRoleMutation,
  useGetRoleAssociationsQuery,
  useAddPermissionToRoleMutation,
  useRemovePermissionFromRoleMutation,
} = roleAPI
