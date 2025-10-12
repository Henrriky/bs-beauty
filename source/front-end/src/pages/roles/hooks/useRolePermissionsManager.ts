import { useState, useEffect, useCallback } from 'react'
import { toast } from 'react-toastify'
import { useGetPermissionsQuery } from '../../../store/permission/permission-api'
import {
  useAddPermissionToRoleMutation,
  useRemovePermissionFromRoleMutation,
  useGetRoleAssociationsQuery,
} from '../../../store/role/role-api'
import { Permission } from '../types'

interface UseRolePermissionsManagerProps {
  roleId: string
}

interface PermissionsByResource {
  [resource: string]: Permission[]
}

export function useRolePermissionsManager({
  roleId,
}: UseRolePermissionsManagerProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [tempPermissions, setTempPermissions] = useState<Set<string>>(new Set())
  const [initialPermissions, setInitialPermissions] = useState<Set<string>>(
    new Set(),
  )
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)

  // RTK Query hooks
  const {
    data: permissionsResponse,
    isLoading: isLoadingPermissions,
    error: permissionsError,
  } = useGetPermissionsQuery({
    page: 1,
    limit: 50, // Buscar todas as permissions
    filters: searchTerm
      ? {
          search: searchTerm,
        }
      : {},
  })

  const { data: associationsResponse, isLoading: isLoadingAssociations } =
    useGetRoleAssociationsQuery({
      id: roleId,
      page: 1,
      limit: 50,
      filters: { type: 'permission' },
    })

  const [addPermissionToRole, { isLoading: isAdding }] =
    useAddPermissionToRoleMutation()
  const [removePermissionFromRole, { isLoading: isRemoving }] =
    useRemovePermissionFromRoleMutation()

  // Inicializar permissions da role
  useEffect(() => {
    if (associationsResponse?.data?.[0]?.permissions) {
      const currentPermissionIds = new Set(
        associationsResponse.data[0].permissions.map((p) => p.id),
      )
      setInitialPermissions(currentPermissionIds)
      setTempPermissions(currentPermissionIds)
    }
  }, [associationsResponse])

  // Verificar se há mudanças não salvas
  useEffect(() => {
    const hasChanges =
      initialPermissions.size !== tempPermissions.size ||
      [...initialPermissions].some((id) => !tempPermissions.has(id)) ||
      [...tempPermissions].some((id) => !initialPermissions.has(id))

    setHasUnsavedChanges(hasChanges)
  }, [initialPermissions, tempPermissions])

  // Organizar permissões por recurso
  const permissionsByResource: PermissionsByResource = (
    permissionsResponse?.data || []
  ).reduce((acc, permission) => {
    if (!acc[permission.resource]) {
      acc[permission.resource] = []
    }
    acc[permission.resource].push(permission)
    return acc
  }, {} as PermissionsByResource)

  const handlePermissionToggle = useCallback((permissionId: string) => {
    setTempPermissions((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(permissionId)) {
        newSet.delete(permissionId)
      } else {
        newSet.add(permissionId)
      }
      return newSet
    })
  }, [])

  const handleResourceToggle = useCallback(
    (resource: string) => {
      const resourcePermissions = permissionsByResource[resource] || []
      const resourcePermissionIds = resourcePermissions.map((p) => p.id)

      const allSelected = resourcePermissionIds.every((id) =>
        tempPermissions.has(id),
      )

      setTempPermissions((prev) => {
        const newSet = new Set(prev)

        if (allSelected) {
          // Desmarcar todos do recurso
          resourcePermissionIds.forEach((id) => newSet.delete(id))
        } else {
          // Marcar todos do recurso
          resourcePermissionIds.forEach((id) => newSet.add(id))
        }

        return newSet
      })
    },
    [permissionsByResource, tempPermissions],
  )

  const handleSaveChanges = useCallback(async () => {
    try {
      const permissionsToAdd = [...tempPermissions].filter(
        (id) => !initialPermissions.has(id),
      )
      const permissionsToRemove = [...initialPermissions].filter(
        (id) => !tempPermissions.has(id),
      )

      // Processar adições em paralelo
      const addPromises = permissionsToAdd.map((permissionId) =>
        addPermissionToRole({
          roleId,
          data: { permissionId },
        }).unwrap(),
      )

      // Processar remoções em paralelo
      const removePromises = permissionsToRemove.map((permissionId) =>
        removePermissionFromRole({
          roleId,
          data: { permissionId },
        }).unwrap(),
      )

      // Executar todas as operações em paralelo
      await Promise.all([...addPromises, ...removePromises])

      // Atualizar estado inicial
      setInitialPermissions(new Set(tempPermissions))

      toast.success('Permissões atualizadas com sucesso!')
    } catch (error) {
      console.error('Error updating permissions:', error)
      const message =
        (error as { data?: { message?: string } })?.data?.message ||
        'Erro ao atualizar permissões'
      toast.error(message)

      // Reverter mudanças em caso de erro
      setTempPermissions(new Set(initialPermissions))
    }
  }, [
    tempPermissions,
    initialPermissions,
    roleId,
    addPermissionToRole,
    removePermissionFromRole,
  ])

  const handleDiscardChanges = useCallback(() => {
    setTempPermissions(new Set(initialPermissions))
  }, [initialPermissions])

  const getResourceStats = useCallback(
    (resource: string) => {
      const resourcePermissions = permissionsByResource[resource] || []
      const selectedCount = resourcePermissions.filter((p) =>
        tempPermissions.has(p.id),
      ).length
      const totalCount = resourcePermissions.length

      return {
        selectedCount,
        totalCount,
        isAllSelected: selectedCount === totalCount && totalCount > 0,
        isPartialSelected: selectedCount > 0 && selectedCount < totalCount,
      }
    },
    [permissionsByResource, tempPermissions],
  )

  return {
    // Estado
    searchTerm,
    tempPermissions,
    initialPermissions,
    hasUnsavedChanges,

    // Dados processados
    permissionsByResource,
    allPermissions: permissionsResponse?.data || [],
    totalSelectedCount: tempPermissions.size,
    totalAvailableCount: (permissionsResponse?.data || []).length,

    // Estados de loading
    isLoading: isLoadingPermissions || isLoadingAssociations,
    isSaving: isAdding || isRemoving,

    // Erros
    permissionsError,

    // Handlers
    setSearchTerm,
    handlePermissionToggle,
    handleResourceToggle,
    handleSaveChanges,
    handleDiscardChanges,
    getResourceStats,
  }
}
