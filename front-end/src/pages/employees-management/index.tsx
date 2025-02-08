import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { z } from 'zod'
import { Button } from '../../components/button/Button'
import { Input } from '../../components/inputs/Input'
import useAppSelector from '../../hooks/use-app-selector'
import { Employee } from '../../store/auth/types'
import { employeeAPI } from '../../store/employee/employee-api'
import { EmployeeSchemas } from '../../utils/validation/zod-schemas/employee.zod-schemas.validation.utils'
import { EmployeeCard } from './components/EmployeeCard'
import { ErrorMessage } from '../../components/feedback/ErrorMessage'
import BSBeautyLoading from '../../components/feedback/Loading'

type EmployeeFormData = z.infer<typeof EmployeeSchemas.createSchema>

function EmployeesManagement() {
  const { data, isLoading, isError, error, refetch } =
    employeeAPI.useFetchEmployeesQuery()
  const employees = data?.employees || []

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<EmployeeFormData>({
    resolver: zodResolver(EmployeeSchemas.createSchema),
    mode: 'onSubmit',
  })

  const username = useAppSelector((state) => state.auth.user?.name!)

  const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>([])
  const [search, setSearch] = useState('')

  const [isInsertModalOpen, setIsModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [employeeToDelete, setEmployeeToDelete] = useState<Employee | null>(
    null
  )

  useEffect(() => {
    document.title = 'BS Beauty - Gerenciamento de Funcionários'
  }, [])

  if (isError) {
    toast.error('Erro ao carregar a lista de clientes')
    console.error(error)

    return (
      <ErrorMessage message="Erro ao carregar informações. Tente novamente mais tarde." />
    )
  }

  useEffect(() => {
    setFilteredEmployees(
      employees.filter((employee) =>
        employee.email.toLowerCase().includes(search.toLowerCase())
      )
    )
  }, [search, employees])

  const [deleteEmployee] = employeeAPI.useDeleteEmployeeMutation()

  const handleDelete = async () => {
    if (employeeToDelete) {
      try {
        await deleteEmployee(employeeToDelete.id).unwrap()
        toast.success('Funcionário excluído com sucesso!')
        refetch()
      } catch (error) {
        console.error('Erro ao excluir funcionário:', error)
        toast.error('Erro ao tentar excluir o funcionário. Tente novamente.')
      } finally {
        setIsDeleteModalOpen(false)
        setEmployeeToDelete(null)
      }
    }
  }

  const translateError = (details: string): string => {
    switch (details) {
      case 'Employee already exists.':
        return 'Funcionário já existe.'
      case 'Invalid email format.':
        return 'Formato de e-mail inválido.'
      default:
        return 'Ocorreu um erro. Por favor, verifique o campo de e-mail e tente novamente.'
    }
  }

  const [insertEmployee] = employeeAPI.useInsertEmployeeMutation()

  const handleAddEmployee = async (data: EmployeeFormData) => {
    try {
      await insertEmployee({ email: data.email }).unwrap()
      toast.success('Funcionário adicionado com sucesso!')
      setIsModalOpen(false)
      reset()
      refetch()
    } catch (error: any) {
      console.error('Erro ao adicionar funcionário:', error)
      const errorMessage =
        error.response?.data?.details ||
        'Erro ao tentar adicionar o funcionário.'
      toast.error(translateError(errorMessage))
    }
  }

  return (
    <div className="p-4">
      <h2 className="text-lg font-medium text-secondary-200 mb-4">
        Gerenciamento de Funcionários
      </h2>
      <span className="text-sm text-[#D9D9D9]">
        Olá, <span className="text-primary-200 font-bold">{username}</span>!
        Nessa tela você pode gerenciar os colaboradores cadastrados na{' '}
        <span className="text-secondary-200 font-bold">BS Beauty</span>.
      </span>

      {isLoading ? (
        <div className="mt-5">
          <BSBeautyLoading title="Carregando as informações..." />
        </div>
      ) : (
        <>
          <div className="mb-6">
            <input
              type="text"
              className="bg-zinc-800 w-full text-white text-sm mt-4 border-none px-5 py-1 border rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Pesquisar por e-mail do funcionário..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              aria-label="Pesquisar por e-mail do funcionário"
            />
          </div>

          <button
            className="bg-primary-500 text-white px-5 py-3 rounded-full text-xl shadow-lg hover:bg-primary-600 transition-transform transform hover:scale-105 absolute bottom-16 right-11 z-10"
            onClick={() => setIsModalOpen(true)}
          >
            +
          </button>

          <div className="mt-6 max-h-[70vh] overflow-y-auto scroll relative">
            {filteredEmployees.length > 0 ? (
              filteredEmployees.map((employee) => (
                <EmployeeCard
                  key={employee.id}
                  employee={employee}
                  onDelete={(employee) => {
                    setEmployeeToDelete(employee)
                    setIsDeleteModalOpen(true)
                  }}
                />
              ))
            ) : (
              <p className="text-center text-gray-400">
                Nenhum colaborador encontrado.
              </p>
            )}
          </div>
        </>
      )}

      {
        isDeleteModalOpen && (
          <div
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-20"
            onClick={(e) => {
              if (e.target === e.currentTarget) setIsDeleteModalOpen(false)
            }}
          >
            <div className="bg-primary-900 p-6 rounded-lg shadow-lg w-96 ml-5 mr-5">
              <h3 className="text-lg font-medium mb-4 text-[#D9D9D9]">
                Confirmar Exclusão
              </h3>
              <p className="mb-4 text-white text-justify">
                Tem certeza que deseja excluir o funcionário com e-mail{' '}
                <strong>{employeeToDelete?.email}</strong>?
              </p>
              <p className="mb-4 text-white text-justify">
                Essa alteração não poderá ser desfeita e o funcionário perderá
                todos os dados cadastrados.{' '}
              </p>
              <div className="flex justify-end gap-2">
                <button
                  className="bg-gray-500 text-white px-4 py-2 rounded-md"
                  onClick={() => setIsDeleteModalOpen(false)}
                >
                  Cancelar
                </button>
                <button
                  className="bg-primary-500 text-white px-4 py-2 rounded-md"
                  onClick={handleDelete}
                >
                  Excluir
                </button>
              </div>
            </div>
          </div>
        )
      }

      {
        isInsertModalOpen && (
          <div
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-20"
            onClick={(e) => {
              if (e.target === e.currentTarget) setIsModalOpen(false)
            }}
          >
            <div className="bg-primary-900 p-6 rounded-lg shadow-lg w-96 ml-5 mr-5">
              <h3 className="text-lg font-medium mb-4 text-[#D9D9D9] ">
                Adicionar Funcionário
              </h3>
              <form onSubmit={handleSubmit(handleAddEmployee)}>
                <Input
                  registration={register('email')}
                  id="email"
                  type="email"
                  placeholder="Digite o e-mail do novo funcionário"
                  autoComplete="off"
                  error={errors.email?.message?.toString()}
                />
                <div className="flex justify-end gap-2 mt-5">
                  <button
                    className="bg-gray-500 text-white px-4 py-2 rounded-md"
                    onClick={() => setIsModalOpen(false)}
                    type="button"
                  >
                    Cancelar
                  </button>
                  <Button
                    type="submit"
                    label="Adicionar"
                    className="bg-primary-500 text-white px-4 py-2 rounded-md w-min text-base"
                  />
                </div>
              </form>
            </div>
          </div>
        )
      }
    </div>
  )
}

export default EmployeesManagement;
