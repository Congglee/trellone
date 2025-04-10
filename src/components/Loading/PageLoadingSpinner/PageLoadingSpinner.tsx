import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import Typography from '@mui/material/Typography'

interface PageLoadingSpinnerProps {
  caption?: string
}

export default function PageLoadingSpinner({ caption = 'Loading...' }: PageLoadingSpinnerProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 2,
        width: '100vw',
        height: '100vh'
      }}
    >
      <CircularProgress />
      <Typography>{caption}</Typography>
    </Box>
  )
}
