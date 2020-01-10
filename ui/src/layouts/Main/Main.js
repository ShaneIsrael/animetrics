import React, { useState } from 'react'
import PropTypes from 'prop-types'
import clsx from 'clsx'
import CssBaseline from '@material-ui/core/CssBaseline';
import Hidden from '@material-ui/core/Hidden';
import { makeStyles } from '@material-ui/styles'
import {isMobileOnly} from 'react-device-detect'
import { Sidebar, Header } from './components'

const drawerWidth = 225
const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    minHeight: '100vh',
  },
  drawer: {
    [theme.breakpoints.up('sm')]: {
      width: drawerWidth,
      flexShrink: 0,
    },
  },
  app: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  main: {
    flex: 1,
    padding: isMobileOnly ? 4 : theme.spacing(2),
    background: '#111b29',
  },
  footer: {
    padding: isMobileOnly ? 4 : theme.spacing(2),
    background: '#eaeff1',
  },
}))

const Main = props => {
  const { children } = props

  const classes = useStyles()
  // const isDesktop = useMediaQuery(theme.breakpoints.up('lg'), {
  //   defaultMatches: true
  // })

  const [openSidebar, setOpenSidebar] = useState(false)

  const handleSidebarOpen = () => {
    setOpenSidebar(!openSidebar)
  }

  // const handleSidebarClose = () => {
  //   setOpenSidebar(false)
  // }

  return (
    <div
      className={clsx({
        [classes.root]: true
      })}
    >
      <CssBaseline />
      <nav className={classes.drawer}>
        <Hidden
          implementation="js"
          smUp
        >
          <Sidebar
            onClose={handleSidebarOpen}
            open={openSidebar}
            PaperProps={{ style: { width: drawerWidth } }}
            variant="temporary"
          />
        </Hidden>
        <Hidden
          implementation="js"
          xsDown
        >
          <Sidebar PaperProps={{ style: { width: drawerWidth } }} />
        </Hidden>
      </nav>
      <div className={classes.app}>
        <Hidden
          implementation="js"
          smUp
        >
          <Header onDrawerToggle={handleSidebarOpen} />
        </Hidden>
        <main className={classes.main}>
          {children}
        </main>
      </div>
    </div>
  )
}

Main.propTypes = {
  children: PropTypes.node
}

export default Main
