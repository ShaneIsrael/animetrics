import React, { useState } from 'react'
import PropTypes from 'prop-types'
import clsx from 'clsx'
import { makeStyles, useTheme } from '@material-ui/styles'
import { useMediaQuery, Paper } from '@material-ui/core'

import { Sidebar, Topbar, Footer } from './components'

const useStyles = makeStyles(theme => ({
  root: {
    paddingTop: 56,
    height: '100%',
    [theme.breakpoints.up('sm')]: {
      paddingTop: 64
    }
  },
  shiftContent: {
    paddingLeft: 240
  },
  content: {
    height: '100%'
  }
}))

const Main = props => {
  const { children } = props

  const classes = useStyles()
  const theme = useTheme()
  const isDesktop = useMediaQuery(theme.breakpoints.up('lg'), {
    defaultMatches: true
  })

  const [openSidebar, setOpenSidebar] = useState(false)

  const handleSidebarOpen = () => {
    setOpenSidebar(!openSidebar)
  }

  const handleSidebarClose = () => {
    setOpenSidebar(false)
  }

  return (
    <div
      className={clsx({
        [classes.root]: true,
        [classes.shiftContent]: false
      })}
    >
      <Topbar onSidebarOpen={handleSidebarOpen} />
      <Sidebar
        onClose={handleSidebarClose}
        open={openSidebar}
        variant="temporary"
      />
      <Paper square={true} className={classes.content}>
        {children}
        <Footer />
      </Paper>
    </div>
  )
}

Main.propTypes = {
  children: PropTypes.node
}

export default Main
