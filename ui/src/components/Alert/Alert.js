/* eslint-disable react/no-multi-comp */
import React, { useState } from 'react'
import PropTypes from 'prop-types'
import clsx from 'clsx'
import CheckCircleIcon from '@material-ui/icons/CheckCircle'
import ErrorIcon from '@material-ui/icons/Error'
import InfoIcon from '@material-ui/icons/Info'
import CloseIcon from '@material-ui/icons/Close'
import { amber, green, yellow } from '@material-ui/core/colors'
import IconButton from '@material-ui/core/IconButton'
import SnackbarContent from '@material-ui/core/SnackbarContent'
import WarningIcon from '@material-ui/icons/Warning'
import EmojiObjectsIcon from '@material-ui/icons/EmojiObjects'
import { makeStyles } from '@material-ui/core/styles'
import { Collapse, CircularProgress, Snackbar } from '@material-ui/core'

const variantIcon = {
  success: CheckCircleIcon,
  warning: WarningIcon,
  error: ErrorIcon,
  info: InfoIcon,
  motd: EmojiObjectsIcon,
  loading: function() {
    return <CircularProgress
      color="inherit"
      size={18}
      style={{ marginRight: 8 }}
      thickness={6}
    />
  }
}

const useStyles1 = makeStyles((theme) => ({
  success: {
    color: theme.palette.common.white,
    backgroundColor: green[600]
  },
  error: {
    color: theme.palette.common.white,
    backgroundColor: theme.palette.error.dark
  },
  info: {
    backgroundColor: theme.palette.primary.main
  },
  warning: {
    backgroundColor: amber[700]
  },
  motd: {
    backgroundColor: yellow[400]
  },
  loading: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white
  },
  icon: {
    fontSize: 20
  },
  iconVariant: {
    opacity: 0.9,
    marginRight: theme.spacing(1)
  },
  message: {
    display: 'flex',
    alignItems: 'center',
  }
}))

function MySnackbarContentWrapper(props) {
  const classes = useStyles1()
  const { className, message, variant, onClose, closeable,...other } = props
  const Icon = variantIcon[variant]

  return (
    <SnackbarContent
      action={closeable && [
        <IconButton
          aria-label="close"
          color="inherit"
          key="close"
          onClick={onClose}
          style={{display: 'flex-end'}}
        >
          <CloseIcon className={classes.icon} />
        </IconButton>
      ]}
      aria-describedby="client-snackbar"
      className={clsx(classes[variant], className)}
      message={
        <span
          className={classes.message}
          id="client-snackbar"
        >
          <Icon className={clsx(classes.icon, classes.iconVariant)} />
          {message}
        </span>
      }
      {...other}
    />
  )
}

MySnackbarContentWrapper.propTypes = {
  className: PropTypes.string,
  message: PropTypes.string,
  onClose: PropTypes.func,
  closeable: PropTypes.bool,
  variant: PropTypes.oneOf(['error', 'info', 'success', 'warning', 'loading', 'motd']).isRequired
}

const alertStyles = makeStyles((theme) => ({
  marginTopBottom: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1)
  },
  marginSurround: {
    margin: theme.spacing(1)
  },
  alert: {
    display: 'contents'
  }
}))

export default function Alert(props) {
  const alertTimer = 6000
  const classes = alertStyles()
  const { variant, message, timed, nopad } = props

  const [isOpen, setOpen] = useState(true)

  function handleClose(_, reason) {
    return reason === 'clickaway' ? '' : setOpen(false)
  }

  return (
    <Snackbar
      autoHideDuration={timed ? alertTimer : null}
      className={classes.alert}
      onClose={handleClose}
      open={isOpen}
      TransitionComponent={Collapse}
    >
      <MySnackbarContentWrapper
        className={nopad ? classes.marginTopBottom : classes.marginSurround}
        message={message}
        onClose={handleClose}
        variant={variant ? variant : 'info'}
        closeable={variant === 'motd'}
      />
    </Snackbar>
  )
}
