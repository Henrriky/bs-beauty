import { Box, CircularProgress } from '@mui/material'

interface LoadingPlaceholderProps {
  message?: string
  minHeight?: number
}

function LoadingPlaceholder({
  message = 'Carregando...',
  minHeight = 200,
}: LoadingPlaceholderProps) {
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
      {message && (
        <Box sx={{ ml: 2, color: '#A4978A', fontSize: 16 }}>{message}</Box>
      )}
    </Box>
  )
}

export default LoadingPlaceholder
