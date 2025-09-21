import { Select } from '../../../../../../../../components/select'
import { FindAllServicesParams } from '../../../../../../../../store/service/types'

interface ServiceFilterFormProps {
  filters: FindAllServicesParams
  onFiltersChange: (filters: FindAllServicesParams) => void
  categories: string[]
}

function ServiceFilterForm({
  filters,
  onFiltersChange,
  categories,
}: ServiceFilterFormProps) {
  return (
    <div className="flex items-stretch h-[42px] w-full border border-[#3B3B3B] focus-within:ring-1 focus-within:border-[#B19B86] rounded-md">
      {/* Select */}
      <div className="flex items-center px-3">
        <Select
          value={filters.category}
          onChange={(e) =>
            onFiltersChange({ ...filters, category: e.target.value })
          }
          className="border-none focus:ring-0 bg-transparent p-0 text-ellipsis text-sm w-full"
        >
          <option value="">Categoria</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </Select>
      </div>

      <div className="h-full w-[1px] bg-[#3B3B3B]/50" />

      {/* Input */}
      <div className="flex items-center px-3">
        <input
          type="text"
          placeholder="Buscar..."
          value={filters.q}
          onChange={(e) => onFiltersChange({ ...filters, q: e.target.value })}
          className="w-full border-none focus:outline-none focus:ring-0 bg-transparent text-[#bebebe] text-sm placeholder:text-[#bebebe]/70"
        />
      </div>
    </div>
  )
}

export default ServiceFilterForm
