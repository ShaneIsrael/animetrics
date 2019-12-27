/* eslint-disable react/no-multi-comp */
import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import IconButton from '@material-ui/core/IconButton'
import Typography from '@material-ui/core/Typography'
import CloseIcon from '@material-ui/icons/Close'
import Slide from '@material-ui/core/Slide'
import { DialogContent, DialogContentText, TextField } from '@material-ui/core'

import { DialogService } from 'services'
import Alert from 'components/Alert'

const useStyles = makeStyles(theme => ({
  appBar: {
    position: 'relative',
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1,
  },
  textField: {
    height: '100%'
  }
}))

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
})

export default function FeedbackDialog(props) {
  const classes = useStyles()

  const [ text, setText ] = React.useState('')
  const [ error, setError ] = React.useState(null)
  const { handleClose, open } = props

  const maxLength = 1000

  const handleChange = (event) => {
    const length = event.target.value.length
    if (length <= maxLength) {
      setText(event.target.value)
    } else {
      setText(event.target.value.slice(0, maxLength))
    }
  }

  const closeHandler = () => {
    setText('')
    setError(null)
    handleClose()
  }
  const handleSubmit = async () => {
    try {
      handleClose()
      await DialogService.submitFeedback(text)
      setText('')
    } catch (err) {
      if (err.response) {
        setError(err.response.data)
      }
    }
  }
  return (
    <div>
      <Dialog fullScreen open={open} onClose={closeHandler} TransitionComponent={Transition}>
        <AppBar className={classes.appBar}>
          <Toolbar>
            <IconButton edge="start" color="inherit" onClick={closeHandler} aria-label="close">
              <CloseIcon />
            </IconButton>
            <Typography variant="h6" className={classes.title}>
              Feedback
            </Typography>
            <Button autoFocus color="inherit" onClick={handleSubmit}>
              Submit
            </Button>
          </Toolbar>
        </AppBar>
        <DialogContent>
          {error && 
            <Alert variant="error" message={error}/>
          }
          <DialogContentText>
            Your feedback will help me continue to improve Animetrics. If there is something you like or do not like, please let me know. If there is a feature that you would like to see I would love to hear about it. Thanks!
          </DialogContentText>
          <TextField
            id="feedbackField"
            label={`${text.length}/${maxLength}`}
            variant="outlined"
            multiline
            rows={10}
            fullWidth={true}
            value={text}
            onChange={handleChange}
            className={classes.textField}
          >

            
          </TextField>
        </DialogContent>
      </Dialog>
    </div>
  )
}
