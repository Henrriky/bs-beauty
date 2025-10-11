/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck

import { toast } from 'react-toastify'
import { ErrorMessage } from '../../components/feedback/ErrorMessage'
import BSBeautyLoading from '../../components/feedback/Loading'
import Title from '../../components/texts/Title'
import { customerAPI } from '../../store/customer/customer-api'
import { CustomerList } from './components/CustomerList'
import { UserCanAccessContainer } from '../../components/authorization/UserCanAccessContainer'
import { UserType } from '../../store/auth/types'

function Customers() {
  const { data, isLoading, isError, error } =
    customerAPI.useFetchCustomersQuery()

  const customers = data?.data || []

  if (isLoading) {
    return <BSBeautyLoading title="Carregando as informações..." />
  }

  if (isError) {
    toast.error('Erro ao carregar a lista de clientes')
    console.error(error)

    return (
      <ErrorMessage message="Erro ao carregar informações. Tente novamente mais tarde." />
    )
  }

  if (!data) {
    toast.warn('Informações não disponíveis no momento')
    return (
      <div className="flex justify-center items-center h-full text-yellow-500">
        Nenhuma informação disponível.
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col justify-between">
      <Title align="left">Listagem de clientes</Title>
      <UserCanAccessContainer
        allowedPermissions={['customer.read']}
        allowedUserTypes={[UserType.MANAGER]}
      >
        <div className="flex flex-col max-h-[80vh] overflow-y-scroll px-4">
          <CustomerList customers={customers} isLoading={isLoading} />
        </div>
      </UserCanAccessContainer>
    </div>
  )
}

export default Customers
