import React, { useState } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import clsx from 'clsx'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/styles'
import { AppBar, Toolbar, Badge, Hidden, IconButton } from '@material-ui/core'
import MenuIcon from '@material-ui/icons/Menu'
import NotificationsIcon from '@material-ui/icons/NotificationsOutlined'
import InputIcon from '@material-ui/icons/Input'

const useStyles = makeStyles(theme => ({
  root: {
    boxShadow: 'none'
  },
  flexGrow: {
    flexGrow: 1
  },
  hamburger: {
    marginRight: '25px',
  },
  signOutButton: {
    marginLeft: theme.spacing(1)
  }
}))

const Topbar = props => {
  const { className, onSidebarOpen, ...rest } = props

  const classes = useStyles()

  const [notifications] = useState([])

  return (
    <AppBar
      {...rest}
      className={clsx(classes.root, className)}
    >
      <Toolbar>
        <IconButton
          className={classes.hamburger}
          color="inherit"
          onClick={onSidebarOpen}
        >
          <MenuIcon />
        </IconButton>
        <RouterLink to="/">
          <img
            alt="ANIRANKS Logo"
            src="/images/logos/logo.png"
            height={32}
          />
        </RouterLink>
        <div className={classes.flexGrow} />
      </Toolbar>
    </AppBar>
  )
}

Topbar.propTypes = {
  className: PropTypes.string,
  onSidebarOpen: PropTypes.func
}

export default Topbar
