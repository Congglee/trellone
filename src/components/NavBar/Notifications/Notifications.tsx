import DoneIcon from '@mui/icons-material/Done'
import GroupAddIcon from '@mui/icons-material/GroupAdd'
import MoreHorizIcon from '@mui/icons-material/MoreHoriz'
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone'
import NotInterestedIcon from '@mui/icons-material/NotInterested'
import Badge from '@mui/material/Badge'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import Divider from '@mui/material/Divider'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import { format } from 'date-fns'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { NOTIFICATION_LIMIT, NOTIFICATION_PAGE } from '~/constants/pagination'
import { BoardInvitationStatus } from '~/constants/type'
import { useAppDispatch, useAppSelector } from '~/lib/redux/hooks'
import { useGetInvitationsQuery, useUpdateBoardInvitationMutation } from '~/queries/invitations'
import { BoardInvitationType, InvitationType } from '~/schemas/invitation.schema'
import { addNotification, appendNotifications, setNotifications } from '~/store/slices/notification.slice'

export default function Notifications() {
  const [anchorNotificationsMenuElement, setAnchorNotificationsMenuElement] = useState<null | HTMLElement>(null)
  const [hasNewNotification, setHasNewNotification] = useState(false)

  const isNotificationsMenuOpen = Boolean(anchorNotificationsMenuElement)

  const handleNotificationsMenuClick = (event: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
    setAnchorNotificationsMenuElement(event.currentTarget)
    setHasNewNotification(false)
  }

  const handleNotificationsMenuClose = () => {
    setAnchorNotificationsMenuElement(null)
  }

  const navigate = useNavigate()

  const dispatch = useAppDispatch()

  const { profile } = useAppSelector((state) => state.auth)
  const { notifications } = useAppSelector((state) => state.notification)
  const { socket } = useAppSelector((state) => state.app)

  const [pagination, setPagination] = useState({
    page: NOTIFICATION_PAGE,
    total_page: 0
  })

  const { data: invitationsData } = useGetInvitationsQuery({
    page: pagination.page,
    limit: NOTIFICATION_LIMIT
  })

  const [updateBoardInvitationMutation] = useUpdateBoardInvitationMutation()

  const updateBoardInvitation = (status: BoardInvitationType['status'], invitationId: string) => {
    updateBoardInvitationMutation({ id: invitationId, body: { status } }).then((res) => {
      if (res.data) {
        const boardInvitation = res.data.result.invitation.board_invitation

        if (boardInvitation?.status === BoardInvitationStatus.Accepted) {
          const invitee = res.data.result.invitee
          const boardId = boardInvitation.board_id

          socket?.emit('CLIENT_USER_ACCEPTED_BOARD_INVITATION', { boardId, invitee })

          navigate(`/boards/${boardInvitation.board_id}`)
        }
      }
    })
  }

  useEffect(() => {
    if (invitationsData) {
      const { invitations, page, total_page } = invitationsData.result

      setPagination({ page, total_page })

      if (page === NOTIFICATION_PAGE) {
        dispatch(setNotifications(invitations))
      } else {
        dispatch(appendNotifications(invitations))
      }
    }
  }, [invitationsData, dispatch])

  useEffect(() => {
    const onConnect = () => {
      console.log('Connected to socket server')
    }

    const onDisconnect = () => {
      console.log('Disconnected from socket server')
    }

    if (socket?.connected) {
      onConnect()
    }

    const onReceiveNewInvitation = (invitation: InvitationType) => {
      if (invitation.invitee_id === profile?._id) {
        dispatch(addNotification(invitation))
        setHasNewNotification(true)
      }
    }

    socket?.on('SERVER_USER_INVITED_TO_BOARD', onReceiveNewInvitation)
    socket?.on('connect', onConnect)
    socket?.on('disconnect', onDisconnect)

    return () => {
      socket?.off('SERVER_USER_INVITED_TO_BOARD', onReceiveNewInvitation)
      socket?.off('connect', onConnect)
      socket?.off('disconnect', onDisconnect)
    }
  }, [dispatch, profile, socket])

  const getMoreNotifications = () => {
    if (pagination.page < pagination.total_page) {
      setPagination((prev) => ({ ...prev, page: prev.page + 1 }))
    }
  }

  const showMoreButton = pagination.page < pagination.total_page

  return (
    <Box>
      <Tooltip title='Notifications'>
        <Badge
          color='warning'
          variant={hasNewNotification ? 'dot' : 'standard'}
          sx={{ cursor: 'pointer' }}
          id='basic-button-open-notification'
          aria-controls={isNotificationsMenuOpen ? 'basic-notification-drop-down' : undefined}
          aria-haspopup='true'
          aria-expanded={isNotificationsMenuOpen ? 'true' : undefined}
          onClick={handleNotificationsMenuClick}
        >
          <NotificationsNoneIcon sx={{ color: hasNewNotification ? 'yellow' : 'inherit' }} />
        </Badge>
      </Tooltip>

      <Menu
        id='basic-notification-drop-down'
        anchorEl={anchorNotificationsMenuElement}
        open={isNotificationsMenuOpen}
        onClose={handleNotificationsMenuClose}
        MenuListProps={{ 'aria-labelledby': 'basic-button-open-notification' }}
        sx={{ mt: 2 }}
      >
        {(!notifications || notifications.length === 0) && (
          <MenuItem sx={{ minWidth: 200 }}>You do not have any new notifications.</MenuItem>
        )}

        {notifications.map((notification, index) => (
          <Box key={index}>
            <MenuItem sx={{ minWidth: 200, maxWidth: 360, overflowY: 'auto' }}>
              <Box
                sx={{
                  maxWidth: '100%',
                  wordBreak: 'break-word',
                  whiteSpace: 'pre-wrap',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 1
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box>
                    <GroupAddIcon fontSize='small' />
                  </Box>
                  <Box>
                    <strong>{notification.inviter?.display_name}</strong> had invited you to join the board{' '}
                    <strong>{notification.board?.title}</strong>
                  </Box>
                </Box>

                {notification.board_invitation?.status === BoardInvitationStatus.Pending && (
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      justifyContent: 'flex-end'
                    }}
                  >
                    <Button
                      className='interceptor-loading'
                      type='submit'
                      variant='contained'
                      color='success'
                      size='small'
                      onClick={() => updateBoardInvitation(BoardInvitationStatus.Accepted, notification._id)}
                    >
                      Accept
                    </Button>
                    <Button
                      className='interceptor-loading'
                      type='submit'
                      variant='contained'
                      color='secondary'
                      size='small'
                      onClick={() => updateBoardInvitation(BoardInvitationStatus.Rejected, notification._id)}
                    >
                      Reject
                    </Button>
                  </Box>
                )}

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: 'flex-end' }}>
                  {notification.board_invitation?.status === BoardInvitationStatus.Accepted && (
                    <Chip icon={<DoneIcon />} label='Accepted' color='success' size='small' />
                  )}
                  {notification.board_invitation?.status === BoardInvitationStatus.Rejected && (
                    <Chip icon={<NotInterestedIcon />} label='Rejected' size='small' />
                  )}
                </Box>

                <Box sx={{ textAlign: 'right' }}>
                  <Typography component='span' sx={{ fontSize: '13px' }}>
                    {format(new Date(notification.created_at), 'dd/MM/yyyy HH:mm:ss')}
                  </Typography>
                </Box>
              </Box>
            </MenuItem>

            {index !== notifications?.length - 1 && <Divider />}
          </Box>
        ))}

        {showMoreButton && (
          <>
            <Divider />
            <Button
              variant='text'
              size='medium'
              fullWidth
              color='primary'
              endIcon={<MoreHorizIcon />}
              sx={{
                textTransform: 'none',
                fontSize: '0.875rem',
                fontWeight: 500,
                '&:hover': {
                  backgroundColor: 'rgba(25, 118, 210, 0.04)'
                }
              }}
              onClick={getMoreNotifications}
            >
              More notifications
            </Button>
          </>
        )}
      </Menu>
    </Box>
  )
}
