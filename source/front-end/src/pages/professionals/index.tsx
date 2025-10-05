import { Button } from '../../components/button/Button'
import { ProfessionalList } from './components/ProfessionalList'
import { PlusIcon } from '@heroicons/react/24/outline'
import { useProfessionalsLogic } from './hooks/useProfessionalsLogic'
import useAppSelector from '../../hooks/use-app-selector'
import { UserType } from '../../store/auth/types'
import { Pagination } from '../../components/select/Pagination'
import { useState } from 'react'
import { DeleteProfessionalModal } from './components/DeleteProfessionalModal'
import { ProfessionalFormModal } from './components/ProfessionalFormModal'
import { ProfessionalRolesModal } from './components/ProfessionalRolesModal'
import SearchInput from '../../components/inputs/SearchInput'
import Title from '../../components/texts/Title'
import { UserCanAccessContainer } from '../../components/authorization/UserCanAccessContainer'

function Professionals() {
  const { name: username } = useAppSelector((state) => state.auth!.user!)
  const [searchTerm, setSearchTerm] = useState('')

  const {
    professionals,
    pagination,
    filters,
    selectedProfessional,
    professionalToDelete,
    professionalToManageRoles,
    isLoadingProfessionals,
    isCreating,
    isDeleting,
    isFormModalOpen,
    isDeleteModalOpen,
    isRolesModalOpen,
    handlePageChange,
    handleFiltersChange,
    clearFilters,
    openCreateModal,
    closeFormModal,
    openDeleteModal,
    closeDeleteModal,
    openRolesModal,
    closeRolesModal,
    handleCreateProfessional,
    handleDeleteProfessional,
  } = useProfessionalsLogic()

  const handleSearch = (value: string) => {
    handleFiltersChange({
      ...filters,
      email: value || undefined,
    })
  }

  const handleSearchChange = (value: string) => {
    setSearchTerm(value)
  }

  const handleClearSearch = () => {
    setSearchTerm('')
    clearFilters()
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Title align="left">Gerenciamento de Profissionais</Title>
      <div className="mt-2">
        <span className="text-sm text-[#D9D9D9]">
          Olá, <span className="text-primary-200 font-bold">{username}</span>!
          Nessa tela você pode gerenciar os colaboradores cadastrados na{' '}
          <span className="text-secondary-200 font-bold">BS Beauty</span>.
        </span>
      </div>

      <UserCanAccessContainer
        allowedPermissions={['professional.read']}
        allowedUserTypes={[UserType.MANAGER]}
      >
        {/* Filters */}
        <div className="bg-primary-800 rounded-2xl p-6">
          <div>
            <label className="block text-sm font-medium text-primary-0 mb-2">
              Buscar por nome
            </label>
            <SearchInput
              value={searchTerm}
              onChange={handleSearchChange}
              onClear={handleClearSearch}
              onSearch={handleSearch}
              enableDebouncing={false}
              placeholder="Digite o e-mail do funcionário..."
              aria-label="Pesquisar por e-mail do funcionário"
            />
          </div>
        </div>

        {/* Professional List */}
        <ProfessionalList
          professionals={professionals}
          isLoading={isLoadingProfessionals}
          onDelete={openDeleteModal}
          onManageProfessionalRoles={openRolesModal}
        />

        {/* Pagination */}
        <Pagination
          totalItems={pagination.totalItems}
          totalPages={pagination.totalPages}
          currentPage={pagination.currentPage}
          pageLimit={pagination.pageLimit}
          onPageChange={handlePageChange}
        />
      </UserCanAccessContainer>

      <UserCanAccessContainer
        allowedPermissions={['professional.create']}
        allowedUserTypes={[UserType.MANAGER]}
      >
        {/* Create Button */}
        <Button
          onClick={openCreateModal}
          variant="solid"
          label={
            <div className="flex items-center justify-center gap-2">
              <PlusIcon className="h-4 w-4" />
              Criar funcionário
            </div>
          }
          className="w-full"
        />
      </UserCanAccessContainer>

      {/* Create Modal */}
      <ProfessionalFormModal
        isOpen={isFormModalOpen}
        professional={selectedProfessional}
        isLoading={isCreating}
        onClose={closeFormModal}
        onSubmit={handleCreateProfessional}
      />

      {/* Delete Modal */}
      <DeleteProfessionalModal
        isOpen={isDeleteModalOpen}
        professional={professionalToDelete}
        isLoading={isDeleting}
        onClose={closeDeleteModal}
        onConfirm={handleDeleteProfessional}
      />

      {/* User Roles Modal */}
      <ProfessionalRolesModal
        isOpen={isRolesModalOpen}
        professional={professionalToManageRoles}
        onClose={closeRolesModal}
      />
    </div>
  )
}

export default Professionals
