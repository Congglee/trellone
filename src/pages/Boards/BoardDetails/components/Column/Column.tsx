import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import Box from '@mui/material/Box'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import { CSSProperties, useState } from 'react'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import AddCardIcon from '@mui/icons-material/AddCard'
import ContentCut from '@mui/icons-material/ContentCut'
import ContentCopy from '@mui/icons-material/ContentCopy'
import ContentPaste from '@mui/icons-material/ContentPaste'
import Divider from '@mui/material/Divider'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import Cloud from '@mui/icons-material/Cloud'
import CardsList from '~/pages/Boards/BoardDetails/components/CardsList'
import Button from '@mui/material/Button'
import DragHandleIcon from '@mui/icons-material/DragHandle'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import TextField from '@mui/material/TextField'
import CloseIcon from '@mui/icons-material/Close'
import { useClickAway } from '@uidotdev/usehooks'
import { ColumnType } from '~/schemas/column.schema'
import { useAddCardMutation } from '~/queries/cards'
import { useAppDispatch, useAppSelector } from '~/lib/redux/hooks'
import { cloneDeep } from 'lodash'
import { updateActiveBoard } from '~/store/slices/board.slice'
import { useConfirm } from 'material-ui-confirm'
import { useDeleteColumnMutation } from '~/queries/columns'

interface ColumnProps {
  column: ColumnType
}

export default function Column({ column }: ColumnProps) {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | SVGSVGElement | null>(null)
  const open = Boolean(anchorEl)

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: column._id,
    data: { ...column }
  })

  const dndKitColumnsStyles: CSSProperties = {
    touchAction: 'none',
    transform: CSS.Translate.toString(transform),
    transition,
    height: '100%',
    opacity: isDragging ? 0.5 : undefined
  }

  const [newCardFormOpen, setNewCardFormOpen] = useState(false)
  const [newCardTitle, setNewCardTitle] = useState('')

  const { activeBoard } = useAppSelector((state) => state.board)
  const dispatch = useAppDispatch()

  const sortedCards = column.cards!

  const newCardClickAwayRef = useClickAway(() => {
    setNewCardFormOpen(false)
    setNewCardTitle('')
  })

  const toggleNewCardForm = () => {
    setNewCardFormOpen(!newCardFormOpen)
  }

  const reset = () => {
    toggleNewCardForm()
    setNewCardTitle('')
  }

  const [addCardMutation] = useAddCardMutation()
  const [deleteColumnMutation] = useDeleteColumnMutation()

  const addNewCard = async () => {
    if (!newCardTitle || newCardTitle.trim() === '') {
      return
    }

    const addNewCardRes = await addCardMutation({
      title: newCardTitle,
      column_id: column._id,
      board_id: column.board_id
    }).unwrap()

    const newCard = cloneDeep(addNewCardRes.result)

    const newActiveBoard = cloneDeep(activeBoard)
    const columnToUpdate = newActiveBoard?.columns?.find((column) => column._id === newCard.column_id)

    if (columnToUpdate) {
      if (columnToUpdate.cards?.some((card) => card.FE_PlaceholderCard)) {
        columnToUpdate.cards = [newCard]
        columnToUpdate.card_order_ids = [newCard._id]
      } else {
        columnToUpdate.cards?.push(newCard)
        columnToUpdate.card_order_ids?.push(newCard._id)
      }
    }

    dispatch(updateActiveBoard(newActiveBoard))

    reset()
  }

  const confirmDeleteColumn = useConfirm()

  const deleteColumn = () => {
    confirmDeleteColumn({
      title: 'Delete Column?',
      description: 'This action will permanently delete your Column and its Cards! Are you sure?',
      confirmationText: 'Confirm',
      cancellationText: 'Cancel'
    })
      .then(() => {
        const newActiveBoard = { ...activeBoard! }

        newActiveBoard.columns = newActiveBoard.columns?.filter((col) => col._id !== column._id)
        newActiveBoard.column_order_ids = newActiveBoard.column_order_ids?.filter((_id) => _id !== column._id)

        dispatch(updateActiveBoard(newActiveBoard))

        deleteColumnMutation(column._id)
      })
      .catch(() => {})
  }

  return (
    <div ref={setNodeRef} style={dndKitColumnsStyles} {...attributes}>
      <Box
        {...listeners}
        sx={{
          minWidth: '300px',
          maxWidth: '300px',
          ml: 2,
          bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#333643' : '#ebecf0'),
          borderRadius: '6px',
          height: 'fit-content',
          maxHeight: (theme) => `calc(${theme.trellone.boardContentHeight} - ${theme.spacing(5)})`
        }}
      >
        <Box
          sx={{
            height: (theme) => theme.trellone.columnHeaderHeight,
            p: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <Typography variant='h6' sx={{ fontSize: '1rem', fontWeight: '600', cursor: 'pointer' }}>
            {column.title}
          </Typography>
          <Box>
            <Tooltip title='More options'>
              <ExpandMoreIcon
                sx={{ color: 'text.primary', cursor: 'pointer', verticalAlign: 'middle' }}
                id='basic-column-dropdown'
                aria-controls={open ? 'basic-menu-column-dropdown' : undefined}
                aria-haspopup='true'
                aria-expanded={open ? 'true' : undefined}
                onClick={(e) => setAnchorEl(e.currentTarget)}
              />
            </Tooltip>
            <Menu
              id='basic-menu-column-dropdown'
              anchorEl={anchorEl}
              open={open}
              onClose={() => setAnchorEl(null)}
              MenuListProps={{
                'aria-labelledby': 'basic-column-dropdown'
              }}
            >
              <MenuItem>
                <ListItemIcon>
                  <AddCardIcon fontSize='small' />
                </ListItemIcon>
                <ListItemText>Add new card</ListItemText>
              </MenuItem>
              <MenuItem>
                <ListItemIcon>
                  <ContentCut fontSize='small' />
                </ListItemIcon>
                <ListItemText>Cut</ListItemText>
              </MenuItem>
              <MenuItem>
                <ListItemIcon>
                  <ContentCopy fontSize='small' />
                </ListItemIcon>
                <ListItemText>Copy</ListItemText>
              </MenuItem>
              <MenuItem>
                <ListItemIcon>
                  <ContentPaste fontSize='small' />
                </ListItemIcon>
                <ListItemText>Paste</ListItemText>
              </MenuItem>
              <Divider />
              <MenuItem onClick={deleteColumn}>
                <ListItemIcon>
                  <DeleteForeverIcon fontSize='small' />
                </ListItemIcon>
                <ListItemText>Remove this column</ListItemText>
              </MenuItem>
              <MenuItem>
                <ListItemIcon>
                  <Cloud fontSize='small' />
                </ListItemIcon>
                <ListItemText>Archive this column</ListItemText>
              </MenuItem>
            </Menu>
          </Box>
        </Box>

        <CardsList cards={sortedCards} />

        <Box
          sx={{
            height: (theme) => theme.trellone.columnFooterHeight,
            p: 2
          }}
        >
          {!newCardFormOpen ? (
            <Box
              sx={{
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <Button startIcon={<AddCardIcon />} onClick={toggleNewCardForm}>
                Add new card
              </Button>
              <Tooltip title='Drag to move'>
                <DragHandleIcon sx={{ cursor: 'pointer' }} />
              </Tooltip>
            </Box>
          ) : (
            <Box
              sx={{
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}
              ref={newCardClickAwayRef}
            >
              <TextField
                label='Enter card title...'
                type='text'
                size='small'
                variant='outlined'
                autoFocus
                data-no-dnd='true'
                value={newCardTitle}
                onChange={(e) => setNewCardTitle(e.target.value)}
                sx={{
                  bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#22272b' : '#fff'),
                  '& label': { color: 'text.primary' },
                  '& label.Mui-focused': {
                    color: (theme) => theme.palette.primary.main
                  },
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: (theme) => theme.palette.primary.main
                    },
                    '&:hover fieldset': {
                      borderColor: (theme) => theme.palette.primary.main
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: (theme) => theme.palette.primary.main
                    }
                  },
                  '& .MuiOutlinedInput-input': {
                    borderRadius: 1
                  }
                }}
                inputProps={{
                  style: { fontWeight: '400', fontSize: '0.875rem', lineHeight: '1.43', letterSpacing: '0.01071em' }
                }}
              />
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Button
                  onClick={addNewCard}
                  variant='contained'
                  size='small'
                  sx={{
                    boxShadow: 'none',
                    border: '0.5px solid'
                  }}
                >
                  Add
                </Button>
                <CloseIcon
                  fontSize='small'
                  sx={{
                    color: (theme) => theme.palette.warning.light,
                    cursor: 'pointer'
                  }}
                  onClick={toggleNewCardForm}
                />
              </Box>
            </Box>
          )}
        </Box>
      </Box>
    </div>
  )
}
