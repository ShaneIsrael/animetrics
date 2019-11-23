import React, {useEffect} from 'react'
import {isMobile} from 'react-device-detect'
import { makeStyles } from '@material-ui/styles'
// eslint-disable-next-line
import { Grid, Paper, InputLabel, FormControl, Select, MenuItem } from '@material-ui/core'
import moment from 'moment'
import { AnimeRankingResult, DetailsCard } from './components'
import { WeekService, ResultsService } from '../../services'
import clsx from 'clsx'

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(1)
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 200,
    width: '100%'
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
  rankingsPaper: {
    padding: 10,
  },
  scrolling: {
    overflowX: 'scroll',
  },
  selectedAnimeCard: {
    maxHeight: '100vh'
  }

}))

function createResults(results, setHandler) {
  try {
    if (Object.keys(results).length === 0) return []
    const render = results.map((res, index) => {
      const posPrevious = res.previous ? res.previous.position : null
      console.log(res)
      return <AnimeRankingResult 
        banner={`${res.show.id}_${res.asset.season}.png`}
        commentCount={res.result.comment_count}
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

function createPollResults(results) {
  try {
    const prevPollResults = results.map((res, index) => {
      return {
        id: res.result.id,
        poll: res.previous.poll ? res.previous.poll : {score: 0}
      }
    })
    const pollResults = results.map((res, index) => {
      return {
        id: res.result.id,
        title: res.show.title,
        episode: res.discussion.episode,
        banner: `${res.show.id}_${res.asset.season}_head.png`,
        poll: res.poll,
      }
    })
    pollResults.sort((a, b) => b.poll.score - a.poll.score)
    prevPollResults.sort((a, b) => {
      return b.poll.score - a.poll.score
    })
    return {current: pollResults, previous: prevPollResults}
  } catch (err) {
    console.log(err)
  }    
}

const Dashboard = () => {
  const classes = useStyles()
  // eslint-disable-next-line
  const inputLabel = React.useRef(null);
  const [selectedWeek, setSelectedWeek] = React.useState(0);
  const [weekSelectOptions, setWeekSelectOptions] = React.useState([])
  const [selectedAnime, setSelectedAnime] = React.useState(null)
  const [renderedResults, setRenderedResults] = React.useState([])
  const [renderedPollResults, setRenderedPollResults] = React.useState({})

  const setAnimeSelection = (selection) => {
    setSelectedAnime(selection)
  }

  useEffect(() => {
    async function fetchData() {
      try {
        const weeks = (await WeekService.getWeeks()).data
        const results = (await ResultsService.getResultsByWeek(weeks[1].id)).data
        setSelectedWeek(weeks[1].id)
        createWeekSelectOptions(weeks)
        setRenderedResults(createResults(results, setAnimeSelection))
        setRenderedPollResults(createPollResults(results))
      } catch (err) {
        console.log(err)
      }
    }
    fetchData()
  }, [])

  const createWeekSelectOptions = async (weeks) => {
    const weekSelectOptions = weeks.map((week, index) => {
      const start = moment(week.start_dt, 'YYYY-MM-DD HH:mm:ss').format('MMM Do, YYYY')
      const end = moment(week.end_dt, 'YYYY-MM-DD HH:mm:ss').format('MMM Do, YYYY')
      if (index === 0) {
        return isMobile ? <option key={index} value={week.id}>Current Week</option> : <MenuItem key={index} value={week.id}><em>Current Week</em></MenuItem>
      } else {
        return isMobile 
          ? 
          <option key={index} value={week.id}>{start} &rarr; {end}</option>
          :
          <MenuItem key={index} value={week.id}>{start} &rarr; {end}</MenuItem>
      }
    })
    setWeekSelectOptions(weekSelectOptions)
  }

  const handleChange = async event => {
    setSelectedWeek(event.target.value);
    try {
      const results = (await ResultsService.getResultsByWeek(event.target.value)).data
      setRenderedResults(createResults(results, setAnimeSelection))
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <div className={clsx({[classes.root]: true, [classes.scrolling]: isMobile})}>
      <Grid
        container
        justify="center"
        spacing={4}
      >
        <Grid container
          item
          justify="center"
          xs={12}
        >
          <Grid item
            xs={4}
          >
            <div>
              <FormControl 
                className={classes.formControl}
                // variant="outlined"
              >
                {/* <InputLabel 
                  id="select-week-label"
                  ref={inputLabel}
                >Week Of</InputLabel> */}
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

        </Grid>
        {selectedAnime && 
          <DetailsCard className={classes.selectedAnimeCard} selectedAnime={selectedAnime}/>
        }
        <Paper className={clsx({[classes.rankingsPaper]: true})}
          elevation={10}
          square={true}
        >
          <div>
            {renderedResults}
          </div>
        </Paper>
      </Grid>
    </div>
  )
}

export default Dashboard
