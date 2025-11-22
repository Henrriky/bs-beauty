import { Box, Typography } from '@mui/material'
import { UserPlusIcon } from '@heroicons/react/24/outline'
import ChartContainer from './ChartContainer'
import { ReportCard } from './ReportCard'
import type { NewCustomersCount } from '../../../store/reports/types'

interface NewCustomersCardProps {
  data?: NewCustomersCount
  isLoading?: boolean
}

export default function NewCustomersCard({
  data,
  isLoading,
}: NewCustomersCardProps) {
  const renderContent = () => {
    if (!data) return null

    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: 200,
          gap: 2,
        }}
      >
        <Box sx={{ textAlign: 'center' }}>
          <Typography
            sx={{
              fontSize: 14,
              color: '#A4978A',
              fontWeight: 500,
              textTransform: 'uppercase',
              letterSpacing: 1,
              mb: 1,
            }}
          >
            Novos Clientes Cadastrados
          </Typography>
          <Typography
            sx={{
              fontSize: 48,
              fontWeight: 700,
              color: '#fff',
              lineHeight: 1,
            }}
          >
            {data.totalCustomers}
          </Typography>
        </Box>

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            px: 3,
            py: 1.5,
            bgcolor: 'rgba(164, 151, 138, 0.1)',
            borderRadius: 2,
          }}
        >
          <UserPlusIcon style={{ width: 20, height: 20, color: '#A4978A' }} />
          <Typography sx={{ fontSize: 14, color: '#ccc' }}>
            {data.totalCustomers === 1 ? 'Cliente' : 'Clientes'} no período
            selecionado
          </Typography>
        </Box>
      </Box>
    )
  }

  return (
    <ChartContainer title="Captação de Clientes">
      <ReportCard
        data={data}
        isLoading={isLoading}
        emptyIcon={<UserPlusIcon style={{ width: 48, height: 48, color: '#666' }} />}
        emptyMessage="Nenhum dado disponível para o período selecionado"
        minHeight={200}
      >
        {renderContent()}
      </ReportCard>
    </ChartContainer>
  )
}
