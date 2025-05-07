/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck

import { toast } from 'react-toastify'
import { ErrorMessage } from '../../components/feedback/ErrorMessage'
import BSBeautyLoading from '../../components/feedback/Loading'
import Title from '../../components/texts/Title'
import { customerAPI } from '../../store/customer/customer-api'
import { firstLetterOfWordToUpperCase } from '../../utils/formatter/first-letter-of-word-to-upper-case.util'
import UserCard from './components/UserCard'

function Customers() {
  const { data, isLoading, isError, error } =
    customerAPI.useFetchCustomersQuery()

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
      <div className="flex flex-col max-h-[80vh] overflow-y-scroll px-4">
        {data.customers &&
          data.customers.map((customer) => {
            return (
              <>
                <UserCard
                  key={customer.id}
                  title={firstLetterOfWordToUpperCase(customer.name)}
                  description={customer.email.toLowerCase()}
                  picture={customer.profilePhotoUrl}
                />
              </>
            )
          })}
      </div>
    </div>
  )
}

export default Customers
