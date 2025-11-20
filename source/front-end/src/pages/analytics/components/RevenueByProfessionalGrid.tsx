import { Box, CircularProgress, Typography } from '@mui/material'
import { DataGrid, type GridColDef } from '@mui/x-data-grid'
import ChartContainer from './ChartContainer'
import type { RevenueByProfessional } from '../../../store/reports/types'
import { ptBR } from '@mui/x-data-grid/locales'

interface RevenueByProfessionalGridProps {
  data?: RevenueByProfessional[]
  isLoading?: boolean
}

export default function RevenueByProfessionalGrid({
  data,
  isLoading,
}: RevenueByProfessionalGridProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value)
  }

  const columns: GridColDef[] = [
    {
      field: 'professionalName',
      headerName: 'Profissional',
      flex: 1,
      minWidth: 200,
    },
    {
      field: 'transactionCount',
      headerName: 'Transações',
      flex: 0.6,
      minWidth: 130,
      align: 'right',
      headerAlign: 'right',
    },
    {
      field: 'totalRevenue',
      headerName: 'Faturamento Total',
      flex: 0.8,
      minWidth: 160,
      align: 'right',
      headerAlign: 'right',
      valueFormatter: (value) => formatCurrency(value),
    },
  ]

  const renderContent = () => {
    if (isLoading) {
      return (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: 300,
          }}
        >
          <CircularProgress sx={{ color: '#A4978A' }} />
        </Box>
      )
    }

    if (!data || data.length === 0) {
      return (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: 300,
            gap: 2,
          }}
        >
          <Typography sx={{ color: '#999' }}>
            Nenhum faturamento registrado no período selecionado
          </Typography>
        </Box>
      )
    }

    return (
      <Box sx={{ height: 400, width: '100%' }}>
        <DataGrid
          rows={data}
          columns={columns}
          getRowId={(row) => row.professionalId}
          initialState={{
            pagination: {
              paginationModel: { pageSize: 5, page: 0 },
            },
          }}
          localeText={ptBR.components.MuiDataGrid.defaultProps.localeText}
          pageSizeOptions={[5, 10, 25]}
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
    <ChartContainer title="Faturamento por Profissional">
      {renderContent()}
    </ChartContainer>
  )
}
