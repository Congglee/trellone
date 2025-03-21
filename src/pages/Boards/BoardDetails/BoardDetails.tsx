import { useMediaQuery, useTheme } from '@mui/material'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import { useState } from 'react'
import DrawerHeader from '~/components/DrawerHeader'
import Main from '~/components/Main'
import NavBar from '~/components/NavBar'
import { mockBoardDetails } from '~/constants/mock-data'
import BoardBar from '~/pages/Boards/BoardDetails/components/BoardBar'
import BoardContent from '~/pages/Boards/BoardDetails/components/BoardContent'
import BoardDrawer from '~/pages/Boards/BoardDetails/components/BoardDrawer'
import WorkspaceDrawer from '~/pages/Boards/BoardDetails/components/WorkspaceDrawer'

export default function BoardDetails() {
  const theme = useTheme()
  const isDarkMode = theme.palette.mode === 'dark'
  const isScreenBelowMedium = useMediaQuery(theme.breakpoints.down('md'))

  const [workspaceDrawerOpen, setWorkspaceDrawerOpen] = useState(true)
  const [boardDrawerOpen, setBoardDrawerOpen] = useState(false)

  return (
    <Container disableGutters maxWidth={false} sx={{ height: '100vh' }}>
      <NavBar />
      <Box
        sx={{
          position: 'relative',
          backgroundImage: 'url(https://images6.alphacoders.com/138/thumbbig-1386838.webp)',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        {isDarkMode && (
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              backgroundColor: 'rgba(0, 0, 0, 0.3)',
              mixBlendMode: 'multiply'
            }}
          />
        )}
        <Box sx={{ display: 'flex' }}>
          <WorkspaceDrawer open={workspaceDrawerOpen} onOpen={setWorkspaceDrawerOpen} />
          <BoardBar
            workspaceDrawerOpen={workspaceDrawerOpen}
            onWorkspaceDrawerOpen={setWorkspaceDrawerOpen}
            boardDrawerOpen={boardDrawerOpen}
            onBoardDrawerOpen={setBoardDrawerOpen}
            board={mockBoardDetails}
          />
          <Main
            workspaceDrawerOpen={workspaceDrawerOpen}
            boardDrawerOpen={boardDrawerOpen}
            sx={{
              overflowX: 'auto',
              overflowY: 'hidden',
              height: theme.trellone.boardMainHeight
            }}
          >
            <DrawerHeader />
            {isScreenBelowMedium && <DrawerHeader />}
            <BoardContent board={mockBoardDetails} />
          </Main>
          <BoardDrawer open={boardDrawerOpen} onOpen={setBoardDrawerOpen} />
        </Box>
      </Box>
    </Container>
  )
}
