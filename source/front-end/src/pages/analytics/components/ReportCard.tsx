import { Box, CircularProgress, Typography } from '@mui/material'

interface ReportCardProps<T> {
  data?: T | T[]
  isLoading?: boolean
  emptyIcon: React.ReactNode
  emptyMessage: string
  minHeight?: number
  children: React.ReactNode
}

export function ReportCard<T>({
  data,
  isLoading,
  emptyIcon,
  emptyMessage,
  minHeight = 200,
  children,
}: ReportCardProps<T>) {
  const isArray = Array.isArray(data)
  const isEmptyArray = isArray && (data as T[]).length === 0
  const noData = !data || isEmptyArray

  if (isLoading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight,
        }}
      >
        <CircularProgress sx={{ color: '#A4978A' }} />
      </Box>
    )
  }

  if (noData) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight,
          gap: 2,
        }}
      >
        {emptyIcon}
        <Typography sx={{ color: '#999' }} className="text-center">
          {emptyMessage}
        </Typography>
      </Box>
    )
  }

  return <>{children}</>
}
