import Avatar from '@mui/material/Avatar'
import Tooltip from '@mui/material/Tooltip'
import { BoardResType } from '~/schemas/board.schema'
import { useState } from 'react'
import Box from '@mui/material/Box'
import Popover from '@mui/material/Popover'

interface BoardUserGroupProps {
  boardUsers: BoardResType['result']['FE_AllUsers']
  limit?: number
}

export default function BoardUserGroup({ boardUsers = [], limit = 4 }: BoardUserGroupProps) {
  const [anchorPopoverElement, setAnchorPopoverElement] = useState<HTMLElement | null>(null)
  const isOpenPopover = Boolean(anchorPopoverElement)

  const popoverId = isOpenPopover ? 'board-all-users-popover' : undefined

  const togglePopover = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (!anchorPopoverElement) {
      setAnchorPopoverElement(event.currentTarget)
    } else {
      setAnchorPopoverElement(null)
    }
  }

  return (
    <Box sx={{ display: 'flex', gap: '4px' }}>
      {boardUsers.map((user, index) => {
        if (index < limit) {
          return (
            <Tooltip title={user?.display_name} key={index}>
              <Avatar sx={{ width: 34, height: 34, cursor: 'pointer' }} alt={user?.display_name} src={user?.avatar} />
            </Tooltip>
          )
        }
      })}

      {boardUsers.length > limit && (
        <Tooltip title='Show more'>
          <Box
            aria-describedby={popoverId}
            onClick={togglePopover}
            sx={{
              width: 36,
              height: 36,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '14px',
              fontWeight: '500',
              borderRadius: '50%',
              color: 'text.primary',
              backgroundColor: 'background.paper'
            }}
          >
            +{boardUsers.length - limit}
          </Box>
        </Tooltip>
      )}

      <Popover
        id={popoverId}
        open={isOpenPopover}
        anchorEl={anchorPopoverElement}
        onClose={togglePopover}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Box
          sx={{
            p: 2,
            maxWidth: '235px',
            display: 'flex',
            flexWrap: 'wrap',
            gap: 1
          }}
        >
          {boardUsers.map((user, index) => (
            <Tooltip title={user?.display_name} key={index}>
              <Avatar sx={{ width: 34, height: 34, cursor: 'pointer' }} alt={user?.display_name} src={user?.avatar} />
            </Tooltip>
          ))}
        </Box>
      </Popover>
    </Box>
  )
}
