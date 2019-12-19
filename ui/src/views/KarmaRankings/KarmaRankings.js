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
import { AnimeRankingResult, DetailsCard } from './components'
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
    padding: theme.spacing(0.5),
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
  karmaRankingPaper: {
    padding: 10,
    // width: 700
    width: '100%',
    maxWidth: 700
  },
  selectedAnimeCard: {
    maxHeight: '100vh'
  },
  centerGridItem: {
    // margin: '0 auto'
  }

}))

function createResults(results, setHandler) {
  try {
    if (Object.keys(results).length === 0) return []
    const render = results.map((res, index) => {
      const posPrevious = res.previous ? res.previous.position : null
      return <AnimeRankingResult 
        banner={`https://animetrics.sfo2.cdn.digitaloceanspaces.com/${res.assets[0].s3_banner}`}
        commentCount={res.result.comment_count}
        commentCountPrevious={res.previous.result ? res.previous.result.comment_count : null}
        episode={res.discussion.episode}
        key={5000+index} 
        malScore={res.mal.score.toFixed(2)} 
        malScorePrevious={res.previous.result ? res.previous.mal.score : null}
        pollScore={res.poll.score}
        pollScorePrevious={res.previous.poll ? res.previous.poll.score : 0}
        pos={index}
        posPrevious={posPrevious}
        ralScore={res.result.ralScore}
        ralScorePrevious={res.previous.result ? res.previous.result.ralScore : null}
        result={res}
        score={res.result.ups}
        scorePrevious={res.previous.result ? res.previous.result.ups : null}
        setAnimeSelection={setHandler}
        title={res.show.title}
      />
    })
    return render
  } catch (err) {
    console.log(err)
  }    
}

function useKey(key, handler) {
  // Bind and unbind events
  useEffect(() => {
    // Does an event match the key we're watching?\
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
  }, [key, handler])
}

const KarmaRankings = () => {
  const classes = useStyles()
  // eslint-disable-next-line
  const inputLabel = React.useRef(null);
  const [weeks, setWeeks] = React.useState(null)
  const [selectedWeek, setSelectedWeek] = React.useState(1);
  const [weekSelectOptions, setWeekSelectOptions] = React.useState([])
  const [selectedAnime, setSelectedAnime] = React.useState(null)
  const [renderedResults, setRenderedResults] = React.useState([])

  const setAnimeSelection = (selection) => {
    setSelectedAnime(selection)
  }

  useEffect(() => {
    async function fetchData() {
      try {
        const wks = (await WeekService.getWeeks()).data
        const results = (await ResultsService.getResultsByWeek(wks[1].id)).data
        setWeeks(wks)
        setSelectedWeek(1)
        createWeekSelectOptions(wks)
        setRenderedResults(createResults(results, setAnimeSelection))
      } catch (err) {
        console.log(err)
      }
    }
    fetchData()
  }, [])

  useEffect(() => {
    
    async function fetchData() {
      try {
        const results = (await ResultsService.getResultsByWeek(weeks[selectedWeek].id)).data
        setRenderedResults(createResults(results, setAnimeSelection))
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
          value={index}>Current Week</option> 
          : <MenuItem key={index} value={0}>Current Week</MenuItem>
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
    <div>
      {selectedAnime && 
        <DetailsCard
          className={classes.selectedAnimeCard}
          selectedAnime={selectedAnime}
        />
      }
      <Grid
        container
        justify="center"
        spacing={2}
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
          <Grid container direction="column" justify="center" alignItems="center" >
            <Grid
              item
            >
              <Paper
                className={clsx({[classes.karmaRankingPaper]: true})}
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
                  {renderedResults}
                  {renderedResults.length === 0 &&
                    <Alert
                      variant="info"
                      message="There are currently 0 results for this week. The first results should appear 48 hours after the week begins. Please check back later."
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

export default KarmaRankings
