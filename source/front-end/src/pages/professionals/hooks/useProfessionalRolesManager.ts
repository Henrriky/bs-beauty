import { useState, useEffect, useCallback, useMemo } from 'react'
import { toast } from 'react-toastify'
import {
  useFetchProfessionalRolesQuery,
  useAddRoleToProfessionalMutation,
  useRemoveRoleFromProfessionalMutation,
} from '../../../store/professional/professional-api'
import { useGetRolesQuery } from '../../../store/role/role-api'
import { ProfessionalRole } from '../types'
import { Role } from '../../roles/types'

interface UseProfessionalRolesManagerProps {
  professionalId: string
  isOpen: boolean
}

interface UseProfessionalRolesManagerReturn {
  // Data
  allRoles: Role[]
  professionalRoles: ProfessionalRole[]
  selectedRoleIds: string[]

  // Loading states
  isLoadingRoles: boolean
  isLoadingProfessionalRoles: boolean
  isSaving: boolean

  // Change tracking
  hasChanges: boolean
  pendingChanges: {
    toAdd: string[]
    toRemove: string[]
  }

  // Actions
  toggleRole: (roleId: string) => void
  saveChanges: () => Promise<void>
  resetChanges: () => void

  // Search
  searchTerm: string
  setSearchTerm: (term: string) => void
  filteredRoles: Role[]
}

export function useProfessionalRolesManager({
  professionalId,
  isOpen,
}: UseProfessionalRolesManagerProps): UseProfessionalRolesManagerReturn {
  const [selectedRoleIds, setSelectedRoleIds] = useState<string[]>([])
  const [originalRoleIds, setOriginalRoleIds] = useState<string[]>([])
  const [searchTerm, setSearchTerm] = useState('')

  // API hooks
  const { data: rolesResponse, isLoading: isLoadingRoles } = useGetRolesQuery({
    page: 1,
    limit: 50,
  })

  const {
    data: professionalRolesResponse,
    isLoading: isLoadingProfessionalRoles,
    refetch: refetchProfessionalRoles,
  } = useFetchProfessionalRolesQuery(
    { professionalId },
    { skip: !professionalId || !isOpen },
  )

  const [addRole, { isLoading: isAddingRole }] =
    useAddRoleToProfessionalMutation()
  const [removeRole, { isLoading: isRemovingRole }] =
    useRemoveRoleFromProfessionalMutation()

  // Extract data
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const allRoles = rolesResponse?.data || []
  const professionalRoles = useMemo(
    () => professionalRolesResponse?.roles || [],
    [professionalRolesResponse?.roles],
  )

  // Initialize selected roles when data loads
  useEffect(() => {
    if (professionalRoles.length > 0) {
      const roleIds = professionalRoles.map((pr) => pr.role.id)
      setSelectedRoleIds(roleIds)
      setOriginalRoleIds(roleIds)
    } else if (!isLoadingProfessionalRoles && isOpen) {
      // No roles assigned, reset to empty
      setSelectedRoleIds([])
      setOriginalRoleIds([])
    }
  }, [professionalRoles, isLoadingProfessionalRoles, isOpen])

  // Reset when modal closes
  useEffect(() => {
    if (!isOpen) {
      setSearchTerm('')
      setSelectedRoleIds([])
      setOriginalRoleIds([])
    }
  }, [isOpen])

  // Calculate changes
  const pendingChanges = useMemo(
    () => ({
      toAdd: selectedRoleIds.filter((id) => !originalRoleIds.includes(id)),
      toRemove: originalRoleIds.filter((id) => !selectedRoleIds.includes(id)),
    }),
    [selectedRoleIds, originalRoleIds],
  )

  const hasChanges =
    pendingChanges.toAdd.length > 0 || pendingChanges.toRemove.length > 0
  const isSaving = isAddingRole || isRemovingRole

  // Actions
  const toggleRole = useCallback(
    (roleId: string) => {
      setSelectedRoleIds((prev) => {
        const isSelected = prev.includes(roleId)
        if (isSelected) {
          return prev.filter((id) => id !== roleId)
        } else {
          // Check if role is already assigned to prevent duplicates
          const isAlreadyAssigned = originalRoleIds.includes(roleId)
          if (isAlreadyAssigned && !prev.includes(roleId)) {
            toast.warn('Esta função já está associada ao profissional')
            return [...prev, roleId] // Add it back to show it's selected
          }
          return [...prev, roleId]
        }
      })
    },
    [originalRoleIds],
  )

  const saveChanges = useCallback(async () => {
    if (!hasChanges) {
      toast.info('Nenhuma alteração para salvar')
      return
    }

    try {
      // Add new roles
      for (const roleId of pendingChanges.toAdd) {
        await addRole({
          professionalId,
          data: { roleId },
        }).unwrap()
      }

      // Remove roles
      for (const roleId of pendingChanges.toRemove) {
        await removeRole({
          professionalId,
          data: { roleId },
        }).unwrap()
      }

      // Update original state
      setOriginalRoleIds(selectedRoleIds)

      // Refetch data to ensure consistency
      await refetchProfessionalRoles()

      toast.success('Funções atualizadas com sucesso!')
    } catch (error) {
      console.error('Erro ao salvar alterações:', error)
      toast.error('Erro ao salvar alterações')

      // Reset to original state on error
      setSelectedRoleIds(originalRoleIds)
    }
  }, [
    hasChanges,
    pendingChanges,
    professionalId,
    addRole,
    removeRole,
    selectedRoleIds,
    originalRoleIds,
    refetchProfessionalRoles,
  ])

  const resetChanges = useCallback(() => {
    setSelectedRoleIds(originalRoleIds)
    setSearchTerm('')
  }, [originalRoleIds])

  // Filter roles based on search
  const filteredRoles = useMemo(
    () =>
      allRoles
        .filter(
          (role) =>
            role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            role.description.toLowerCase().includes(searchTerm.toLowerCase()),
        )
        .sort((a, b) =>
          selectedRoleIds.includes(b.id)
            ? 1
            : 0 - (selectedRoleIds.includes(a.id) ? 1 : 0),
        ),
    [allRoles, searchTerm, selectedRoleIds],
  )

  return {
    // Data
    allRoles,
    professionalRoles,
    selectedRoleIds,

    // Loading states
    isLoadingRoles,
    isLoadingProfessionalRoles,
    isSaving,

    // Change tracking
    hasChanges,
    pendingChanges,

    // Actions
    toggleRole,
    saveChanges,
    resetChanges,

    // Search
    searchTerm,
    setSearchTerm,
    filteredRoles,
  }
}
