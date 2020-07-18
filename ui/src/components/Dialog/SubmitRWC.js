/* eslint-disable react/no-multi-comp */
import React, {useEffect} from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import IconButton from '@material-ui/core/IconButton'
import Typography from '@material-ui/core/Typography'
import CloseIcon from '@material-ui/icons/Close'
import Slide from '@material-ui/core/Slide'
import { DialogContent, TextField, FormControl, InputLabel, Select, Grid, MenuItem } from '@material-ui/core'
import { ResourceService } from 'services'
import { Alert } from 'components/Alert'
import ls from 'local-storage'

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
  tokenField: {
    width: 400
  },
  imageField: {
    width: 400
  }
}))

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide
    direction="up"
    ref={ref}
    {...props}
  />;
})

export default function SubmitRWC(props) {
  const classes = useStyles()

  const [ chartType, setChartType ] = React.useState('')
  const [ week, setWeek ] = React.useState('')
  const [ season, setSeason ] = React.useState('')
  const [ year, setYear ] = React.useState('')
  const [authToken, setAuthToken] = React.useState('')
  const [compressedImage, setCompressedImage] = React.useState('')
  const [hdImage, setHDImage] = React.useState('')
  const [ error, setError ] = React.useState(null)
  const [ processing, setProcessing ] = React.useState(false)
  const { handleClose, open } = props


  useEffect(() => {
    async function fetchToken() {
      try {
        setAuthToken(ls('authToken'))
      } catch (err) {
        console.log(err)
      }
    }
    fetchToken()
  }, [])

  const handleIssueTypeChange = event => {
    setChartType(event.target.value)
  }
  const handleWeekChange = event => {
    setWeek(event.target.value)
  }
  const handleSeasonChange = event => {
    setSeason(event.target.value)
  }
  const handleYearChange = event => {
    setYear(event.target.value)
  }
  const handleAuthTokenChange = (e) => {
    ls('authToken', e.target.value)
    setAuthToken(e.target.value)
  }
  const handleCompressedImageChange = (e) => {
    setCompressedImage(e.target.value)
  }
  const handleHDImageChange = (e) => {
    setHDImage(e.target.value)
  }
  const closeHandler = () => {
    setWeek('')
    setSeason('')
    setYear('')
    setChartType('')
    setCompressedImage('')
    setHDImage('')
    setError(null)
    handleClose()
  }

  const handleSubmit = async () => {
    try {
      setError(null)
      if (!compressedImage || !hdImage) {
        return setError('You must enter both a compressed and uncompressed image')
      }
      if (processing) {
        return setError('This job is currently processing, click the submit button again will not make it go faster. ಠ_ಠ')
      }
      setProcessing(true)
      await ResourceService.submitRWC(chartType, season, week, year, compressedImage, hdImage, authToken)
      handleClose()
      setWeek('')
      setSeason('')
      setYear('')
      setChartType('')
      setCompressedImage('')
      setHDImage('')
    } catch (err) {
      if (err.response) {
        setError(err.response.data)
      }
    }
    setProcessing(false)
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
              Submit Chart
            </Typography>
            <Button
              autoFocus
              color="inherit"
              onClick={handleSubmit}
            >
              Submit
            </Button>
          </Toolbar>
        </AppBar>
        <DialogContent>
          {error && 
            <Alert variant="error" message={error}/>
          }
          {
            processing &&
            <Alert variant="loading" message={'Submissing Processing, please wait. This may take a couple seconds...'}/>
          }
          {
            !processing &&
            <React.Fragment>
              <Grid container justify="center">
                <Grid style={{padding: 20}} item>
                  <TextField variant="outlined" spellcheck="false" className={classes.tokenField} value={authToken} onChange={handleAuthTokenChange} label="Authorization Token"/>
                </Grid>
              </Grid>
              <Grid container justify="center">
                <Grid item>
                  <FormControl
                    className={classes.formControl}
                    variant="outlined"
                  >
                    <InputLabel
                      id="chart-type-select"
                    >
                  Chart Type
                    </InputLabel>
                    <Select
                      labelId="chart-type-select"
                      onChange={handleIssueTypeChange}
                      value={chartType}
                      label="Chart Type"
                    >
                      <MenuItem value=""><em>None</em></MenuItem>
                      <MenuItem value={'weekly'}>Weekly Chart</MenuItem>
                      <MenuItem value={'season'}>Season Overview</MenuItem>
                    </Select>
                  </FormControl>
                  {
                    chartType && 
                    <React.Fragment>
                      <FormControl
                        className={classes.formControl}
                        variant="outlined"
                      >
                        <InputLabel
                          id="season-select"
                        >
                        Season
                        </InputLabel>
                        <Select
                          labelId="season-select"
                          onChange={handleSeasonChange}
                          value={season}
                          label="Season"
                        >
                          <MenuItem value=""><em>None</em></MenuItem>
                          <MenuItem value={'fall'}>Fall</MenuItem>
                          <MenuItem value={'winter'}>Winter</MenuItem>
                          <MenuItem value={'spring'}>Spring</MenuItem>
                          <MenuItem value={'summer'}>Summer</MenuItem>
                        </Select>
                      </FormControl>
                      {
                        chartType === 'weekly' &&
                        <FormControl
                          className={classes.formControl}
                          variant="outlined"
                        >
                          <InputLabel
                            id="week-select"
                          >
                          Week
                          </InputLabel>
                          <Select
                            labelId="week-select"
                            onChange={handleWeekChange}
                            value={week}
                            label="Week"
                          >
                            <MenuItem value=""><em>None</em></MenuItem>
                            <MenuItem value={1}>1</MenuItem>
                            <MenuItem value={2}>2</MenuItem>
                            <MenuItem value={3}>3</MenuItem>
                            <MenuItem value={4}>4</MenuItem>
                            <MenuItem value={5}>5</MenuItem>
                            <MenuItem value={6}>6</MenuItem>
                            <MenuItem value={7}>7</MenuItem>
                            <MenuItem value={8}>8</MenuItem>
                            <MenuItem value={9}>9</MenuItem>
                            <MenuItem value={10}>10</MenuItem>
                            <MenuItem value={11}>11</MenuItem>
                            <MenuItem value={12}>12</MenuItem>
                            <MenuItem value={13}>13</MenuItem>
                            <MenuItem value={14}>14</MenuItem>
                          </Select>
                        </FormControl>
                      }
                      <FormControl
                        className={classes.formControl}
                        variant="outlined"
                      >
                        <InputLabel
                          id="year-select"
                        >
                        Year
                        </InputLabel>
                        <Select
                          labelId="year-select"
                          onChange={handleYearChange}
                          value={year}
                          label="Year"
                        >
                          <MenuItem value=""><em>None</em></MenuItem>
                          <MenuItem value={2020}>2020</MenuItem>
                          <MenuItem value={2021}>2021</MenuItem>
                          <MenuItem value={2022}>2022</MenuItem>
                        </Select>
                      </FormControl>
                    </React.Fragment>
                  }
                </Grid>
              </Grid>
              {
                ((chartType === 'season' && (season && year)) || (chartType === 'weekly' && (season && week && year))) &&
                <Grid container justify="center">
                  <Grid style={{padding: 20}} item>
                    <TextField variant="outlined" spellcheck="false" className={classes.imageField} value={compressedImage} onChange={handleCompressedImageChange} label="Compressed (< 700KB) Image URL"/>
                  </Grid>
                  <Grid style={{padding: 20}} item>
                    <TextField variant="outlined" spellcheck="false" className={classes.imageField} value={hdImage} onChange={handleHDImageChange} label="Full Quality Image URL"/>
                  </Grid>
                </Grid>
              }
            </React.Fragment>
          }
        </DialogContent>
      </Dialog>
    </div>
  )
}
