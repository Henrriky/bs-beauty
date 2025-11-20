import { Customer } from '../../../store/auth/types'
import { Pagination } from '../../../components/select/Pagination'
import CustomerCard from './CustomerCard'

interface CustomerListProps {
  customers: Customer[]
  isLoading: boolean
  skeletonCount?: number
  pagination?: {
    currentPage: number
    totalPages: number
    total: number
    onPageChange: (page: number) => void
  }
}

function CustomerList({ customers, isLoading, pagination }: CustomerListProps) {
  if (isLoading) return <CustomerListSkeleton />
  if (customers.length === 0) return <CustomerListEmpty />

  return (
    <>
      <div className="space-y-3">
        {customers.map((customer) => (
          <CustomerCard key={customer.id} customer={customer} />
        ))}
      </div>
      {pagination && pagination.totalPages > 1 && (
        <Pagination
          totalItems={pagination.total}
          totalPages={pagination.totalPages}
          currentPage={pagination.currentPage}
          onPageChange={pagination.onPageChange}
        />
      )}
    </>
  )
}

function CustomerListSkeleton({ count = 10 }: { count?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="w-full bg-[#222222] rounded-2xl border-none px-4 py-3 flex items-center gap-3 animate-pulse"
        >
          <div className="mr-3">
            <div className="h-10 w-10 bg-[#3A3A3A] rounded-full shrink-0"></div>
          </div>
          <div className="flex flex-col gap-1 min-w-0 flex-1">
            <div className="h-4 bg-[#3A3A3A] rounded w-40"></div>
            <div className="h-3 bg-[#3A3A3A] rounded w-48"></div>
            <div className="h-3 bg-[#3A3A3A] rounded w-32"></div>
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
