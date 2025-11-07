import { Dayjs } from 'dayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import StatusFilterInput from '../../../components/inputs/status-filter-input/StatusFilterInput'
import ProfessionalSelector from '../../../components/inputs/professional-selector/ProfessionalSelector'
import { Professional, UserType } from '../../../store/auth/types'
import expandArrow from '../../../assets/expand-arrow.svg'
import 'dayjs/locale/pt-br'
import { SwitchButtonValues } from '../types'

interface ReportFiltersProps {
  startDate: Dayjs | null
  endDate: Dayjs | null
  selectedStatuses: string[]
  selectedProfessional: Professional | null
  professionals: Professional[]
  userType: UserType | undefined
  filtersOpen: boolean
  selectedReportType: SwitchButtonValues
  onStartDateChange: (date: Dayjs | null) => void
  onEndDateChange: (date: Dayjs | null) => void
  onStatusesChange: (statuses: string[]) => void
  onProfessionalChange: (professional: Professional | null) => void
  onToggleFilters: () => void
}

function ReportFilters({
  startDate,
  endDate,
  selectedStatuses,
  selectedProfessional,
  professionals,
  userType,
  filtersOpen,
  selectedReportType,
  onStartDateChange,
  onEndDateChange,
  onStatusesChange,
  onProfessionalChange,
  onToggleFilters,
}: ReportFiltersProps) {
  const hasActiveFilters =
    selectedStatuses.length > 0 || selectedProfessional !== null

  const activeFiltersCount =
    (selectedStatuses.length > 0 ? 1 : 0) +
    (selectedProfessional !== null ? 1 : 0)

  const shouldShowFilters = filtersOpen || hasActiveFilters

  return (
    <>
      <div className="bg-[#262626] rounded-lg p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4 text-[#D9D9D9]">
          Período de Análise
        </h2>
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pt-br">
          <div className="flex">
            <DatePicker
              label="Data Inicial"
              value={startDate}
              onChange={onStartDateChange}
              format="DD/MM/YYYY"
              className="w-1/2"
              slotProps={{
                textField: {
                  sx: {
                    '& .MuiSvgIcon-root': {
                      color: '#A4978A',
                    },
                  },
                },
              }}
            />
            <DatePicker
              label="Data Final"
              value={endDate}
              onChange={onEndDateChange}
              format="DD/MM/YYYY"
              className="w-1/2"
              slotProps={{
                textField: {
                  sx: {
                    '& .MuiSvgIcon-root': {
                      color: '#A4978A',
                    },
                  },
                },
              }}
            />
          </div>
        </LocalizationProvider>
      </div>

      {selectedReportType !== 'customer' && (
        <div className="w-full my-6">
          <button
            onClick={onToggleFilters}
            className="flex justify-center items-center"
          >
            <img
              src={expandArrow}
              alt="Ícone de seta"
              className={`transition-transform duration-500 ${
                shouldShowFilters ? 'rotate-180' : 'rotate-0'
              }`}
            />
            <span className="text-[#B19B86] text-sm ml-[13px]">
              Filtrar resultados
              {hasActiveFilters && (
                <span className="bg-[#A4978A] text-[#1E1E1E] text-xs font-medium px-2 py-1 rounded-full ml-2">
                  {activeFiltersCount} ativo{activeFiltersCount > 1 ? 's' : ''}
                </span>
              )}
            </span>
          </button>

          {shouldShowFilters && (
            <div className="mt-6 space-y-4">
              {userType === UserType.MANAGER && (
                <div>
                  <ProfessionalSelector
                    professionals={professionals}
                    selectedProfessional={selectedProfessional}
                    onSelect={onProfessionalChange}
                    showAllOption={true}
                  />
                </div>
              )}

              <div>
                <StatusFilterInput
                  value={selectedStatuses}
                  onChange={onStatusesChange}
                />
              </div>
            </div>
          )}
        </div>
      )}
    </>
  )
}

export default ReportFilters
