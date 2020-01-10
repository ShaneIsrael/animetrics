import React from 'react'
import { Link as RouterLink } from 'react-router-dom'
import clsx from 'clsx'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/styles'
import { AppBar, Toolbar, IconButton } from '@material-ui/core'
import MenuIcon from '@material-ui/icons/Menu'

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
            alt="Animetrics Logo"
            src="/images/logos/logo_full_light_blue_wlb_stroke.png"
            height={48}
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
