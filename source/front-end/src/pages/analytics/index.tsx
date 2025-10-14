import { PieChart } from '@mui/x-charts/PieChart'
import { analyticsAPI } from '../../store/analytics/analytics-api'

function ProductivityReport() {
  return (
    <PieChart
      series={[
        {
          data: [
            { id: 0, value: 10, label: 'series A' },
            { id: 1, value: 15, label: 'series B' },
            { id: 2, value: 20, label: 'series C' },
          ],
        },
      ]}
    />
  )
}

export default ProductivityReport
