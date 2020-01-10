import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { Alert } from '@material-ui/lab'
import IconButton from '@material-ui/core/IconButton'
import Collapse from '@material-ui/core/Collapse'
import CloseIcon from '@material-ui/icons/Close'

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    '& > * + *': {
      marginTop: theme.spacing(2),
    },
  },
}))


export default function ActionAlert(props) {
  const classes = useStyles();
  const [open, setOpen] = React.useState(true);
  const { type, message, color, closeable, variant } = props

  const action = (
    <IconButton
      aria-label="close"
      color="inherit"
      size="small"
      onClick={() => {
        setOpen(false);
      }}
    >
      <CloseIcon fontSize="inherit" />
    </IconButton>
  )
  return (
    <div className={classes.root}>
      <Collapse in={open}>
        <Alert
          variant={variant ? variant : 'filled'}
          severity={type}
          action={closeable ? action : ''}
          color={color ? color : null}
        >
          {message}
        </Alert>
      </Collapse>
    </div>
  )
}