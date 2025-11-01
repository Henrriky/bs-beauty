import { Button } from '../button/Button'

interface PaginationProps {
  totalItems?: number
  totalPages?: number
  currentPage?: number
  pageLimit?: number
  onPageChange: (page: number) => void
}

export function Pagination({
  totalItems = 0,
  totalPages = 1,
  currentPage = 1,
  onPageChange,
}: PaginationProps) {
  // TODO: Refactor this component to be used
  // TODO: Implement page limit change
  // TODO: Implement two options: page strategy or infinite scroll strategy
  return (
    <div className="bg-primary-800 rounded-2xl p-4 invisible hidden">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="text-sm text-primary-200">
          Página {currentPage} de {totalPages} • {totalItems}{' '}
          {totalItems === 1 ? 'registro' : 'registros'}
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage <= 1}
            variant="outline"
            label="Anterior"
            className="text-sm px-3 py-2"
          />
          <Button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage >= totalPages}
            variant="outline"
            label="Próxima"
            className="text-sm px-3 py-2"
          />
        </div>
      </div>
    </div>
  )
}
