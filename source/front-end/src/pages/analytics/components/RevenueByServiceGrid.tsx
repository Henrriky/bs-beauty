import { Box } from '@mui/material'
import { DataGrid, type GridColDef } from '@mui/x-data-grid'
import { TableCellsIcon } from '@heroicons/react/24/outline'
import ChartContainer from './ChartContainer'
import { ReportCard } from './ReportCard'
import type { RevenueByService } from '../../../store/reports/types'
import { ptBR } from '@mui/x-data-grid/locales'

interface RevenueByServiceGridProps {
  data?: RevenueByService[]
  isLoading?: boolean
}

export default function RevenueByServiceGrid({
  data,
  isLoading,
}: RevenueByServiceGridProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value)
  }

  const columns: GridColDef[] = [
    {
      field: 'serviceName',
      headerName: 'Serviço',
      flex: 1,
      minWidth: 200,
    },
    {
      field: 'category',
      headerName: 'Categoria',
      flex: 0.8,
      minWidth: 150,
    },
    {
      field: 'quantity',
      headerName: 'Quantidade',
      flex: 0.5,
      minWidth: 120,
      align: 'right',
      headerAlign: 'right',
    },
    {
      field: 'totalRevenue',
      headerName: 'Faturamento',
      flex: 0.7,
      minWidth: 140,
      align: 'right',
      headerAlign: 'right',
      valueFormatter: (value) => formatCurrency(value),
    },
  ]

  const renderContent = () => {
    if (!data || data.length === 0) return null

    return (
      <Box sx={{ height: 400, width: '100%' }}>
        <DataGrid
          rows={data}
          columns={columns}
          getRowId={(row) => row.serviceId}
          initialState={{
            pagination: {
              paginationModel: { pageSize: 5, page: 0 },
            },
          }}
          pageSizeOptions={[5, 10, 25]}
          localeText={ptBR.components.MuiDataGrid.defaultProps.localeText}
          disableRowSelectionOnClick
          sx={{
            border: 'none',
            '& .MuiDataGrid-cell': {
              color: '#fff',
              borderColor: 'rgba(255, 255, 255, 0.1)',
            },
            '& .MuiDataGrid-columnHeaders': {
              backgroundColor: 'rgba(164, 151, 138, 0.1)',
              color: '#A4978A',
              borderColor: 'rgba(255, 255, 255, 0.1)',
            },
            '& .MuiDataGrid-footerContainer': {
              borderColor: 'rgba(255, 255, 255, 0.1)',
              color: '#fff',
            },
            '& .MuiTablePagination-root': {
              color: '#fff',
            },
            '& .MuiDataGrid-row:hover': {
              backgroundColor: 'rgba(164, 151, 138, 0.05)',
            },
            '& .MuiDataGrid-columnSeparator': {
              color: 'rgba(255, 255, 255, 0.1)',
            },
          }}
        />
      </Box>
    )
  }

  return (
    <ChartContainer title="Faturamento por Serviço">
      <ReportCard
        data={data}
        isLoading={isLoading}
        emptyIcon={
          <TableCellsIcon style={{ width: 48, height: 48, color: '#666' }} />
        }
        emptyMessage="Nenhum serviço prestado no período selecionado"
        minHeight={300}
      >
        {renderContent()}
      </ReportCard>
    </ChartContainer>
  )
}
