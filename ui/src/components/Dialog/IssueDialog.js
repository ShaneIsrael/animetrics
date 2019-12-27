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
import { DialogContent, TextField, FormControl, InputLabel, Select } from '@material-ui/core'
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
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
}))

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide
    direction="up"
    ref={ref}
    {...props}
  />;
})

export default function IssueDialog(props) {
  const classes = useStyles()

  const [ description, setDescription ] = React.useState('')
  const [ issueType, setIssueType ] = React.useState('')
  const [ error, setError ] = React.useState(null)
  const { handleClose, open } = props

  const maxLength = 1000



  const handleIssueTypeChange = event => {
    setIssueType(event.target.value)
  }
  const handleDescribeIssueChange = (event) => {
    const length = event.target.value.length
    if (length <= maxLength) {
      setDescription(event.target.value)
    } else {
      setDescription(event.target.value.slice(0, maxLength))
    }
  }

  const closeHandler = () => {
    setIssueType('')
    setDescription('')
    setError(null)
    handleClose()
  }

  const handleSubmit = async () => {
    try {
      await DialogService.submitIssue(issueType, description)
      handleClose()
      setIssueType('')
      setDescription('')
    } catch (err) {
      if (err.response) {
        setError(err.response.data)
      }
    }
  }
  return (
    <div>
      <Dialog
        fullScreen
        onClose={closeHandler}
        open={open}
        TransitionComponent={Transition}
      >
        <AppBar className={classes.appBar}>
          <Toolbar>
            <IconButton
              aria-label="close"
              color="inherit"
              edge="start"
              onClick={closeHandler}
            >
              <CloseIcon />
            </IconButton>
            <Typography
              className={classes.title}
              variant="h6"
            >
              Report an Issue
            </Typography>
            <Button
              autoFocus
              color="inherit"
              onClick={handleSubmit}
            >
              Submit Issue
            </Button>
          </Toolbar>
        </AppBar>
        <DialogContent>
          {error && 
            <Alert variant="error" message={error}/>
          }
          <FormControl
            className={classes.formControl}
          >
            <InputLabel
              htmlFor="issue-type-select"
            >
          Issue Type
            </InputLabel>
            <Select
              inputProps={{
                name: 'issueType',
                id: 'issue-type-select',
              }}
              labelWidth={0}
              native
              onChange={handleIssueTypeChange}
              value={issueType}
            >
              <option value="" />
              <option value={'Missing Art'}>Missing Art</option>
              <option value={'Missing Series / Episode'}>Missing Series / Episode</option>
              <option value={'Incorrect Art'}>Incorrect Art</option>
              <option value={'Incorrect Series Information'}>Incorrect Series Information</option>
              <option value={'Other'}>Other</option>
            </Select>
          </FormControl>
          <TextField
            className={classes.textField}
            fullWidth
            id="descriptionField"
            label={`Describe the issue ${description.length}/${maxLength}`}
            multiline
            onChange={handleDescribeIssueChange}
            rows={4}
            value={description}
            variant="outlined"
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}
