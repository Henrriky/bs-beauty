/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck

import { useState } from 'react'
import { toast } from 'react-toastify'
import { ErrorMessage } from '../../components/feedback/ErrorMessage'
import BSBeautyLoading from '../../components/feedback/Loading'
import Title from '../../components/texts/Title'
import { customerAPI } from '../../store/customer/customer-api'
import { CustomerList } from './components/CustomerList'
import { UserCanAccessContainer } from '../../components/authorization/UserCanAccessContainer'
import { UserType } from '../../store/auth/types'
import { PageHeader } from '../../layouts/PageHeader'

function Customers() {
  const [currentPage, setCurrentPage] = useState(1)

  const LIMIT = 10

  const { data, isLoading, isFetching, isError, error } =
    customerAPI.useFetchCustomersQuery({ page: currentPage, limit: LIMIT })

  const customers = data?.data || []

  if (isError) {
    toast.error('Erro ao carregar a lista de clientes')
    console.error(error)
  }

  return (
    <div className="h-full flex flex-col">
      <PageHeader
        title="Listagem de Clientes"
        subtitle="Gerencie as informações dos clientes aqui."
      />
      <UserCanAccessContainer
        allowedPermissions={['customer.read']}
        allowedUserTypes={[UserType.MANAGER]}
      >
        <div className="flex flex-col overflow-y-scroll px-4">
          <CustomerList
            customers={customers}
            isLoading={isLoading || isFetching}
            skeletonCount={LIMIT}
            pagination={
              data ? {
                currentPage: data.page || 1,
                totalPages: data.totalPages || 1,
                total: data.total || 0,
                onPageChange: setCurrentPage,
              } : undefined
            }
          />
          {!isLoading && !isError && !data && (
            <div className="flex justify-center items-center h-full text-yellow-500">
              Nenhuma informação disponível.
            </div>
          )}
          {isError && <ErrorMessage message="Erro ao carregar informações. Tente novamente mais tarde." />}
        </div>
      </UserCanAccessContainer>
    </div>
  )
}


export default Customers
