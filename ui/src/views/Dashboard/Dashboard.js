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
    if (!results.length > 0) return []
    const render = results.map((res, index) => {
      const posPrevious = res.previous ? res.previous.position : null
      return <AnimeRankingResult 
        key={5000+index}
        result={res.result}
        title={res.show.title}
        banner={`${res.show.id}_${res.asset.season}.png`} 
        pos={index} 
        posPrevious={posPrevious}
        score={res.result.ups}
        scorePrevious={res.previous.result.ups}
        commentCount={res.result.comment_count}
        episode={res.discussion.episode}
        malScore={res.mal.score.toFixed(2)}
        malScorePrevious={res.result.previous.mal.score}
        ralScore={9.12}
        ralScorePrevious={9.12}
        pollScore={8.70}
        pollScorePrevious={8.70}
        setAnimeSelection={setHandler}
      />
    })
    return render
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
                  onChange={handleChange} 
                  value={selectedWeek}
                  native={isMobile}
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
