import { createTheme } from '@mui/material/styles'

export const darkChartTheme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      paper: '#262626',
      default: '#1E1E1E',
    },
    text: {
      primary: '#D9D9D9',
      secondary: '#979797',
    },
    primary: {
      main: '#A4978A',
    },
  },
  components: {
    MuiPopper: {
      styleOverrides: {
        root: {
          '& .MuiPaper-root': {
            backgroundColor: '#262626',
            border: '1px solid #535353',
            color: '#D9D9D9',
          },
        },
      },
    },
  },
})
