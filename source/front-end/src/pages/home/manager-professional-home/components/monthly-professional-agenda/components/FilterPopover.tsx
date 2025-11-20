import FilterContainer from '../shared/FilterContainer'
import type { FilterPopoverProps as Props } from '../shared/filter-types'

function FilterPopover(props: Props) {
  return <FilterContainer mode="popover" {...props} />
}

export default FilterPopover
