import { styled } from '@mui/material/styles'

const HiddenInputStyles = styled('input')({
  display: 'none'
  /*
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
  */
})

export default function VisuallyHiddenInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <HiddenInputStyles {...props} />
}
