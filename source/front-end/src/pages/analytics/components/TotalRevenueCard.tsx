import { Box, Typography } from '@mui/material'
import { ArrowTrendingUpIcon } from '@heroicons/react/24/outline'
import ChartContainer from './ChartContainer'
import { ReportCard } from './ReportCard'
import type { TotalRevenue } from '../../../store/reports/types'

interface TotalRevenueCardProps {
  data?: TotalRevenue
  isLoading?: boolean
}

export default function TotalRevenueCard({
  data,
  isLoading,
}: TotalRevenueCardProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value)
  }

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
            Faturamento Total
          </Typography>
          <Typography
            sx={{
              fontSize: 48,
              fontWeight: 700,
              color: '#fff',
              lineHeight: 1,
            }}
          >
            {formatCurrency(data.totalRevenue)}
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
          <ArrowTrendingUpIcon
            style={{ width: 20, height: 20, color: '#A4978A' }}
          />
          <Typography sx={{ fontSize: 14, color: '#ccc' }}>
            <strong style={{ color: '#A4978A', fontWeight: 600 }}>
              {data.transactionCount}
            </strong>{' '}
            {data.transactionCount === 1 ? 'transação' : 'transações'} no
            período
          </Typography>
        </Box>
      </Box>
    )
  }

  return (
    <ChartContainer title="Resumo Financeiro">
      <ReportCard
        data={data}
        isLoading={isLoading}
        emptyIcon={
          <ArrowTrendingUpIcon
            style={{ width: 48, height: 48, color: '#666' }}
          />
        }
        emptyMessage="Nenhum dado disponível para o período selecionado"
        minHeight={200}
      >
        {renderContent()}
      </ReportCard>
    </ChartContainer>
  )
}
