import FilterContainer from '../shared/FilterContainer'
import type { FilterSheetProps as Props } from '../shared/filter-types'

function FilterSheet(props: Props) {
  return <FilterContainer mode="sheet" {...props} />
}

export default FilterSheet
