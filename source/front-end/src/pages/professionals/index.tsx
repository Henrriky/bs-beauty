import { toast } from 'react-toastify'
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
import SearchInput from '../../components/inputs/SearchInput'
import Title from '../../components/texts/Title'

function Professionals() {
  const { name: username, userType } = useAppSelector(
    (state) => state.auth!.user!,
  )
  const [searchTerm, setSearchTerm] = useState('')

  const {
    professionals,
    pagination,
    filters,
    selectedProfessional,
    professionalToDelete,
    isLoadingProfessionals,
    isCreating,
    isDeleting,
    isFormModalOpen,
    isDeleteModalOpen,
    handlePageChange,
    handleFiltersChange,
    clearFilters,
    openCreateModal,
    closeFormModal,
    openDeleteModal,
    closeDeleteModal,
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

  const canManageRoles = userType === UserType.MANAGER

  if (!canManageRoles) {
    return (
      <div className="p-6">
        <div className="bg-primary-800 rounded-2xl p-12 text-center">
          <div className="mb-4">
            <svg
              className="w-16 h-16 text-red-400 mx-auto"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <h2 className="text-xl font-medium text-primary-0 mb-2">
            Acesso Negado
          </h2>
          <p className="text-primary-200">
            Você não tem permissão para acessar esta funcionalidade.
          </p>
        </div>
      </div>
    )
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
        onManageProfessionalRoles={() => {
          toast.info('Em desenvolvimento')
        }}
      />

      {/* Pagination */}
      <Pagination
        totalItems={pagination.totalItems}
        totalPages={pagination.totalPages}
        currentPage={pagination.currentPage}
        pageLimit={pagination.pageLimit}
        onPageChange={handlePageChange}
      />

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
    </div>
  )
}

export default Professionals
