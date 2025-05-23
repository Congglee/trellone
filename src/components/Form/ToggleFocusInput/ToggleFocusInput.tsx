import { StandardTextFieldProps } from '@mui/material'
import { useEffect, useState } from 'react'
import TextField from '@mui/material/TextField'

interface ToggleFocusInputProps extends StandardTextFieldProps {
  value?: string
  onChangeValue?: (title: string) => Promise<void>
  inputFontSize?: string
}

export default function ToggleFocusInput({
  value,
  onChangeValue,
  inputFontSize = '16px',
  ...rest
}: ToggleFocusInputProps) {
  const [localValue, setLocalValue] = useState<string>(value as string)

  // Update local state when the value prop changes (e.g., from realtime updates)
  useEffect(() => {
    if (value !== undefined && value !== localValue) {
      setLocalValue(value)
    }
  }, [value])

  const triggerBlur = () => {
    setLocalValue(localValue.trim())

    if (!localValue || localValue.trim() === value) {
      setLocalValue(value as string)
      return
    }

    onChangeValue && onChangeValue(localValue)
  }

  return (
    <TextField
      id='toggle-focus-input-controlled'
      fullWidth
      variant='outlined'
      size='small'
      value={localValue}
      onChange={(e) => setLocalValue(e.target.value)}
      onBlur={triggerBlur}
      {...rest}
      sx={{
        '& label': {},
        '& input': { fontSize: inputFontSize, fontWeight: 'medium' },
        '& .MuiOutlinedInput-root': {
          backgroundColor: 'transparent',
          '& fieldset': { borderColor: 'transparent' }
        },
        '& .MuiOutlinedInput-root:hover': {
          borderColor: 'transparent',
          '& fieldset': { borderColor: 'transparent' }
        },
        '& .MuiOutlinedInput-root.Mui-focused': {
          backgroundColor: (theme) => (theme.palette.mode === 'dark' ? '#33485D' : 'white'),
          '& fieldset': { borderColor: 'primary.main' }
        },
        '& .MuiOutlinedInput-input': {
          px: '6px',
          overflow: 'hidden',
          whiteSpace: 'nowrap',
          textOverflow: 'ellipsis'
        }
      }}
    />
  )
}
