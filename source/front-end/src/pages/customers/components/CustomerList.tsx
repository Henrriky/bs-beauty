import { Customer } from '../../../store/auth/types'
import CustomerCard from './CustomerCard'

interface CustomerListProps {
  customers: Customer[]
  isLoading: boolean
}

function CustomerList({ customers, isLoading }: CustomerListProps) {
  if (isLoading) return <CustomerListSkeleton />
  if (customers.length === 0) return <CustomerListEmpty />

  return (
    <div>
      {customers.map((customer) => (
        <CustomerCard key={customer.id} customer={customer} />
      ))}
    </div>
  )
}

function CustomerListSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 3 }).map((_, index) => (
        <div
          key={index}
          className="flex items-center gap-4 py-4 px-6 rounded-2xl mt-5 bg-primary-800 animate-pulse border-[1px] border-[#D9D9D9] border-opacity-25"
        >
          <div className="h-12 w-14 bg-primary-400 rounded-full"></div>
          <div className="flex flex-col gap-2 w-full">
            <div className="h-4 bg-primary-400 rounded w-32 mb-2"></div>
            <div className="h-3 bg-primary-400 rounded w-48"></div>
          </div>
        </div>
      ))}
    </div>
  )
}

function CustomerListEmpty() {
  return (
    <div>
      <p className="text-primary-100 text-lg mb-2 text-center">
        Nenhum cliente encontrado
      </p>
    </div>
  )
}

export { CustomerList }
