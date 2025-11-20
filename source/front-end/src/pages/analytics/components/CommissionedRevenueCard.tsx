import { Box, Typography } from '@mui/material'
import { BanknotesIcon } from '@heroicons/react/24/outline'
import ChartContainer from './ChartContainer'
import { ReportCard } from './ReportCard'
import type { CommissionedRevenue } from '../../../store/reports/types'

interface CommissionedRevenueCardProps {
  data?: CommissionedRevenue | null
  isLoading?: boolean
}

export default function CommissionedRevenueCard({
  data,
  isLoading,
}: CommissionedRevenueCardProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value)
  }

  const formatPercentage = (value: number) => {
    return `${(value * 100).toFixed(2)}%`
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
          gap: 3,
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
            Receita Comissionada
          </Typography>
          <Typography
            sx={{
              fontSize: 48,
              fontWeight: 700,
              color: '#4CAF50',
              lineHeight: 1,
            }}
          >
            {formatCurrency(data.commissionedRevenue)}
          </Typography>
          <Typography
            sx={{
              fontSize: 14,
              color: '#999',
              mt: 1,
            }}
          >
            Taxa de comissão: {formatPercentage(data.commissionRate)}
          </Typography>
        </Box>

        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 1,
            width: '100%',
            maxWidth: 400,
          }}
        >
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              px: 3,
              py: 1,
              bgcolor: 'rgba(164, 151, 138, 0.1)',
              borderRadius: 1,
            }}
          >
            <Typography sx={{ fontSize: 14, color: '#ccc' }}>
              Faturamento total:
            </Typography>
            <Typography sx={{ fontSize: 14, color: '#fff', fontWeight: 600 }}>
              {formatCurrency(data.totalRevenue)}
            </Typography>
          </Box>

          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              px: 3,
              py: 1,
              bgcolor: 'rgba(164, 151, 138, 0.1)',
              borderRadius: 1,
            }}
          >
            <Typography sx={{ fontSize: 14, color: '#ccc' }}>
              Transações:
            </Typography>
            <Typography sx={{ fontSize: 14, color: '#fff', fontWeight: 600 }}>
              {data.transactionCount}
            </Typography>
          </Box>
        </Box>
      </Box>
    )
  }

  return (
    <ChartContainer title="Receita com Comissão">
      <ReportCard
        data={data}
        isLoading={isLoading}
        emptyIcon={<BanknotesIcon style={{ width: 48, height: 48, color: '#666' }} />}
        emptyMessage="Profissional não é comissionado ou não há dados disponíveis para o período selecionado"
        minHeight={200}
      >
        {renderContent()}
      </ReportCard>
    </ChartContainer>
  )
}
