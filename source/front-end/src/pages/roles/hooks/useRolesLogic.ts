import { useState, useCallback } from 'react'
import { toast } from 'react-toastify'
import {
  useGetRolesQuery,
  useCreateRoleMutation,
  useUpdateRoleMutation,
  useDeleteRoleMutation,
} from '../../../store/role/role-api'
import { CreateRoleFormData, GetRolesRequestFilters, Role } from '../types'

interface UseRolesLogicProps {
  initialPage?: number
  initialLimit?: number
}

export function useRolesLogic({
  initialPage = 1,
  initialLimit = 10,
}: UseRolesLogicProps = {}) {
  // Estados locais
  const [currentPage, setCurrentPage] = useState(initialPage)
  const [pageLimit, setPageLimit] = useState(initialLimit)
  const [filters, setFilters] = useState<GetRolesRequestFilters>({})
  const [selectedRole, setSelectedRole] = useState<Role | null>(null)
  const [isFormModalOpen, setIsFormModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [roleToDelete, setRoleToDelete] = useState<Role | null>(null)

  // RTK Query hooks
  const {
    data: rolesResponse,
    isLoading: isLoadingRoles,
    error: rolesError,
    refetch: refetchRoles,
  } = useGetRolesQuery({
    page: currentPage,
    limit: pageLimit,
    filters,
  })

  const [createRole, { isLoading: isCreating }] = useCreateRoleMutation()
  const [updateRole, { isLoading: isUpdating }] = useUpdateRoleMutation()
  const [deleteRole, { isLoading: isDeleting }] = useDeleteRoleMutation()

  // Handlers para paginação
  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page)
  }, [])

  const handleLimitChange = useCallback((limit: number) => {
    setPageLimit(limit)
    setCurrentPage(1) // Reset para primeira página
  }, [])

  // Handlers para filtros
  const handleFiltersChange = useCallback(
    (newFilters: GetRolesRequestFilters) => {
      setFilters(newFilters)
      setCurrentPage(1) // Reset para primeira página
    },
    [],
  )

  const clearFilters = useCallback(() => {
    setFilters({})
    setCurrentPage(1)
  }, [])

  // Handlers para modal de formulário
  const openCreateModal = useCallback(() => {
    setSelectedRole(null)
    setIsFormModalOpen(true)
  }, [])

  const openEditModal = useCallback((role: Role) => {
    setSelectedRole(role)
    setIsFormModalOpen(true)
  }, [])

  const closeFormModal = useCallback(() => {
    setIsFormModalOpen(false)
    setSelectedRole(null)
  }, [])

  // Handlers para modal de exclusão
  const openDeleteModal = useCallback((role: Role) => {
    setRoleToDelete(role)
    setIsDeleteModalOpen(true)
  }, [])

  const closeDeleteModal = useCallback(() => {
    setIsDeleteModalOpen(false)
    setRoleToDelete(null)
  }, [])

  // Handler para criar role
  const handleCreateRole = useCallback(
    async (data: CreateRoleFormData) => {
      try {
        await createRole(data).unwrap()
        toast.success('Role criada com sucesso!')
        closeFormModal()
        refetchRoles()
      } catch (error: unknown) {
        console.error('Error creating role:', error)
        const message =
          (error as { data?: { message?: string } })?.data?.message ||
          'Erro inesperado ao criar role'
        toast.error(message)
      }
    },
    [createRole, closeFormModal, refetchRoles],
  )

  // Handler para atualizar role
  const handleUpdateRole = useCallback(
    async (data: CreateRoleFormData) => {
      if (!selectedRole) return

      try {
        await updateRole({ id: selectedRole.id, data }).unwrap()
        toast.success('Role atualizada com sucesso!')
        closeFormModal()
        refetchRoles()
      } catch (error: unknown) {
        console.error('Error updating role:', error)
        const message =
          (error as { data?: { message?: string } })?.data?.message ||
          'Erro inesperado ao atualizar role'
        toast.error(message)
      }
    },
    [updateRole, selectedRole, closeFormModal, refetchRoles],
  )

  // Handler para deletar role
  const handleDeleteRole = useCallback(async () => {
    if (!roleToDelete) return

    try {
      await deleteRole(roleToDelete.id).unwrap()
      toast.success('Role excluída com sucesso!')
      closeDeleteModal()
      refetchRoles()
    } catch (error: unknown) {
      console.error('Error deleting role:', error)
      const message =
        (error as { data?: { message?: string } })?.data?.message ||
        'Erro inesperado ao excluir role'
      toast.error(message)
      closeDeleteModal()
    }
  }, [deleteRole, roleToDelete, closeDeleteModal, refetchRoles])

  return {
    // Estados
    roles: rolesResponse?.data || [],
    pagination: {
      totalItems: rolesResponse?.total || 0,
      totalPages: rolesResponse?.totalPages || 0,
      currentPage,
      pageLimit,
    },
    filters,
    selectedRole,
    roleToDelete,

    // Estados de loading
    isLoadingRoles,
    isCreating,
    isUpdating,
    isDeleting,

    // Estados de modals
    isFormModalOpen,
    isDeleteModalOpen,

    // Errors
    rolesError,

    // Handlers de paginação
    handlePageChange,
    handleLimitChange,

    // Handlers de filtros
    handleFiltersChange,
    clearFilters,

    // Handlers de modals
    openCreateModal,
    openEditModal,
    closeFormModal,
    openDeleteModal,
    closeDeleteModal,

    // Handlers de CRUD
    handleCreateRole,
    handleUpdateRole,
    handleDeleteRole,

    // Utils
    refetchRoles,
  }
}
