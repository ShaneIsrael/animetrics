/* eslint-disable react/no-multi-comp */
import React, {useEffect} from 'react'
import PropTypes from 'prop-types'
import {isMobile} from 'react-device-detect'
import { makeStyles } from '@material-ui/styles'
import Typography from '@material-ui/core/Typography'
import Box from '@material-ui/core/Box'
// eslint-disable-next-line
import { Grid, Paper, InputLabel, FormControl, Select, MenuItem } from '@material-ui/core'
import moment from 'moment'
import { AnimePollRanking } from './components'
import { WeekService, ResultsService } from '../../services'
import clsx from 'clsx'
import { Alert } from 'components'


function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <Typography
      aria-labelledby={`nav-tab-${index}`}
      component="div"
      hidden={value !== index}
      id={`nav-tabpanel-${index}`}
      role="tabpanel"
      {...other}
    >
      <Box p={3}>{children}</Box>
    </Typography>
  )
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
}


const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(1),
    margin: 'auto',
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 200,
    width: '100%'
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
  pollRankingPaper: {
    padding: 10,
    maxWidth: 430
  },
  centerGridItem: {
    margin: '0 auto'
  }

}))

function createPollResults(results) {
  try {
    const render = results.map((poll, index) => {
      return <AnimePollRanking
        current={poll}
        key={index}
      />
    })
    return render
  } catch (err) {
    console.log(err)
  }    
}

function useKey(key, handler) {
  // Does an event match the key we're watching?

  // Bind and unbind events
  useEffect(() => {
    const match = event => key.toLowerCase() === event.key.toLowerCase()
    const onUp = event => {
      if (match(event)) handler()
    }  
    // window.addEventListener('keydown', onDown)
    window.addEventListener('keyup', onUp)
    return () => {
      // window.removeEventListener('keydown', onDown)
      window.removeEventListener('keyup', onUp)
    }
  }, [handler, key])
}

const PollRankings = () => {
  const classes = useStyles()
  // eslint-disable-next-line
  const inputLabel = React.useRef(null);
  const [weeks, setWeeks] = React.useState(null)
  const [selectedWeek, setSelectedWeek] = React.useState(1);
  const [weekSelectOptions, setWeekSelectOptions] = React.useState([])
  const [renderedPollResults, setRenderedPollResults] = React.useState([])

  useEffect(() => {
    async function fetchData() {
      try {
        const wks = (await WeekService.getWeeks()).data
        const pollResults = (await ResultsService.getRedditPollResultsByWeek(wks[1].id)).data
        setWeeks(wks)
        setSelectedWeek(1)
        createWeekSelectOptions(wks)
        setRenderedPollResults(createPollResults(pollResults))
      } catch (err) {
        console.log(err)
      }
    }
    fetchData()
  }, [])

  useEffect(() => {
    
    async function fetchData() {
      try {
        const pollResults = (await ResultsService.getRedditPollResultsByWeek(weeks[selectedWeek].id)).data
        setRenderedPollResults(createPollResults(pollResults))
      } catch (err) {
        console.log(err)
      }
    }
    if (weeks) {
      if (selectedWeek < weeks.length && selectedWeek >= 0) {
        fetchData()
      } else if (selectedWeek === weeks.length) {
        setSelectedWeek(weeks.length)
      } else {
        setSelectedWeek(0)
      }
    }
  }, [weeks, selectedWeek, setSelectedWeek])

  const createWeekSelectOptions = async (weeks) => {
    const weekSelectOptions = weeks.map((week, index) => {
      const start = moment(week.start_dt, 'YYYY-MM-DD HH:mm:ss').format('MMM Do, YYYY')
      const end = moment(week.end_dt, 'YYYY-MM-DD HH:mm:ss').format('MMM Do, YYYY')
      if (index === 0) {
        return isMobile ? <option
          key={index}
          value={index}
        >Current Week</option> 
          : <MenuItem
            key={index}
            value={0}
          >Current Week</MenuItem>
      } else {
        return isMobile 
          ? 
          <option
            key={index}
            value={index}
          >{start} &rarr; {end}</option>
          :
          <MenuItem
            key={index}
            value={index}
          ><center>{start} &rarr; {end}</center></MenuItem>
      }
    })
    setWeekSelectOptions(weekSelectOptions)
  }


  useKey('ArrowRight', () => {
    setSelectedWeek(prevState => prevState + 1)
  })
  useKey('ArrowLeft', () => {
    setSelectedWeek(prevState => prevState - 1)
  })

  const handleChange = async event => {
    setSelectedWeek(event.target.value)
  }

  return (
    <div className={clsx({[classes.root]: true})}>
      <Grid
        container
        justify="center"
        spacing={4}
      >

        <Grid
          container
          item
          justify="center"
          xs={12}
        >
          <Grid
            item
          >
            <div>
              <FormControl 
                className={classes.formControl}
                variant="outlined"
              >
                <Select 
                  className={classes.selectEmpty} 
                  native={isMobile} 
                  onChange={handleChange}
                  value={selectedWeek}
                >
                  {weekSelectOptions}
                </Select>
              </FormControl>
            </div>
          </Grid>
          <Grid
            container
            justify="center"
          >
            <Grid
              item
              className={classes.centerGridItem}
            >
              <Paper
                className={clsx({[classes.pollRankingPaper]: true})}
                elevation={10}
                square
              >
                <Grid
                  container
                  direction="column"
                  justify="center"
                  alignItems="center"
                  spacing={1}
                >
                  {renderedPollResults}
                  {renderedPollResults.length === 0 &&
                  <Alert
                    message="There are currently 0 results for this week. The first results should appear 48 hours after the week beginds. Please check back later."
                    variant="info"
                  />
                  }
                </Grid>
              </Paper>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </div>
  )
}

export default PollRankings
