/* eslint-disable react/no-multi-comp */
import React, {useEffect} from 'react'
import PropTypes from 'prop-types'
import clsx from 'clsx'
import {isMobileOnly, isMobile} from 'react-device-detect'
import { makeStyles, withStyles } from '@material-ui/styles'
import Box from '@material-ui/core/Box'
import ls from 'local-storage'
// eslint-disable-next-line
import { Grid, Paper, FormControl, Select, MenuItem, Switch, Typography } from '@material-ui/core'

import { Alert, KarmaGraphModal, RpGraphModal } from 'components'
import { AnimeRankingResult, DetailsCard } from './components'
import { WeekService, ResultsService, SeasonService } from '../../services'


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
    minWidth: 120,
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
const AntSwitch = withStyles(theme => ({
  root: {
    width: 28,
    height: 16,
    padding: 0,
    display: 'flex',
  },
  switchBase: {
    padding: 2,
    color: theme.palette.grey[500],
    '&$checked': {
      transform: 'translateX(12px)',
      color: theme.palette.common.white,
      '& + $track': {
        opacity: 1,
        backgroundColor: theme.palette.primary.main,
        borderColor: theme.palette.primary.main,
      },
    },
  },
  thumb: {
    width: 12,
    height: 12,
    boxShadow: 'none',
  },
  track: {
    border: `1px solid ${theme.palette.grey[500]}`,
    borderRadius: 16 / 2,
    opacity: 1,
    backgroundColor: theme.palette.common.white,
  },
  checked: {},
}))(Switch)

function createResults(results, setHandler, openKarmaGraphModal, openRpGraphModal) {
  try {
    if (Object.keys(results).length === 0) return []
    const render = results.map((res, index) => {
      const posPrevious = res.previous ? res.previous.position : null
      return <AnimeRankingResult 
        banner={`https://cdn.animetrics.co/${res.assets[0].s3_banner}`}
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
        title={res.show.english_title ? res.show.english_title : res.show.title}
        openKarmaGraphModal={openKarmaGraphModal}
        openRpGraphModal={openRpGraphModal}
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
  const [selectedWeek, setSelectedWeek] = React.useState(0)
  const [seasons, setSeasons] = React.useState(null)
  const [selectedSeason, setSelectedSeason] = React.useState(0)
  const [weekSelectOptions, setWeekSelectOptions] = React.useState([])
  const [seasonSelectOptions, setSeasonSelectOptions] = React.useState([])
  const [selectedAnime, setSelectedAnime] = React.useState(null)
  const [renderedResults, setRenderedResults] = React.useState([])
  const [modernCardStyle, setModernCardStyle] = React.useState(true)

  const setAnimeSelection = (selection) => {
    setSelectedAnime(selection)
  }
  
  const [karmaGraphParams, setKarmaGraphParams] = React.useState(null)
  const openKarmaGraphModal = (seasonId, showId) => {
    setKarmaGraphParams({seasonId, showId})
  }

  const [rpScoreGraphParams, setRpScoreGraphParams] = React.useState(null)
  const openRpGraphModal = (seasonId, showId) => {
    setRpScoreGraphParams({seasonId, showId})
  }

  
  const createWeekSelectOptions = React.useCallback(async (weeks) => {
    let weekSelectOptions = []
    if (!weeks || weeks.length === 0) {
      weekSelectOptions.push(
        isMobile ? <option
                      key={0}
                      value={0}>Current Week</option> 
                  : <MenuItem key={0} value={0}>Current Week</MenuItem>
      )
    } else {
      weekSelectOptions = weeks.map((week, index) => {
        if (index === 0 && selectedSeason === 0) {
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
            >Week {weeks.length - index}</option>
            :
            <MenuItem
              key={index}
              value={index}
        ><center>Week {weeks.length - index}</center></MenuItem>
        }
      })
    }
    setWeekSelectOptions(weekSelectOptions)
  }, [selectedSeason])

  const createSeasonSelectOptions = async (seasons) => {
    const seasonSelectOptions = seasons.map((season, index) => {
      return isMobile 
      ? 
      <option
        key={index}
        value={index}
      >{season.season.replace(/^\w/, c => c.toUpperCase())} of {season.year}</option>
      :
      <MenuItem
        key={index}
        value={index}
      ><center>{season.season.replace(/^\w/, c => c.toUpperCase())} of {season.year}</center></MenuItem>
    })
    setSeasonSelectOptions(seasonSelectOptions)
  }

  
  useEffect(() => {
    async function fetchData() {
      try {
        if (ls.get('modernCardStyle') === null) {
          ls('modernCardStyle', true)
        }
        setModernCardStyle(ls.get('modernCardStyle'))
        const seasons = (await SeasonService.getSeasons()).data
        const wks = (await WeekService.getWeeksBySeason(seasons[0].season, seasons[0].year)).data
        setWeeks(wks)
        setSeasons(seasons)
        createWeekSelectOptions(wks)
        createSeasonSelectOptions(seasons)
        if (wks) {
          const results = (await ResultsService.getResultsByWeek(wks[wks.length > 1 ? 1 : 0].id)).data
          setRenderedResults(createResults(results, setAnimeSelection, openKarmaGraphModal, openRpGraphModal))
        }
      } catch (err) {
        console.log(err)
      }
    }
    fetchData()
  }, [])

  useEffect(() => {
    async function fetchData() {
      try {
        const results = (await ResultsService.getResultsByWeek(weeks[selectedSeason === 0 ? 1 : 0].id)).data
        setRenderedResults(createResults(results, setAnimeSelection, openKarmaGraphModal, openRpGraphModal))
      } catch (err) {
        console.log(err)
      }
    }
    if (weeks) {
      fetchData()
    }
  }, [weeks, selectedSeason])

  useEffect(() => {
    async function fetchData() {
      try {
        if (seasons) {
          const season = seasons[selectedSeason]
          const wks = (await WeekService.getWeeksBySeason(season.season, season.year)).data
          const results = (await ResultsService.getResultsByWeek(wks[0].id)).data
          setWeeks(wks)
          if (selectedSeason === 0 && wks.length > 1) setSelectedWeek(1)
          else setSelectedWeek(0)
          createWeekSelectOptions(wks)
          setRenderedResults(createResults(results, setAnimeSelection, openKarmaGraphModal, openRpGraphModal))
        }
      } catch (err) {
        console.log(err)
      }
    }
    fetchData()
  }, [selectedSeason])

  useEffect(() => {
    async function fetchData() {
      try {
        if (weeks) {
          const results = (await ResultsService.getResultsByWeek(weeks[selectedWeek].id)).data
          setRenderedResults(createResults(results, setAnimeSelection, openKarmaGraphModal, openRpGraphModal))
        }
      } catch (err) {
        console.log(err)
      }
    }
    fetchData()
  }, [selectedWeek])

  useKey('ArrowRight', () => {
    setSelectedWeek(prevState => {
      const total = weeks.length - 1
      if (prevState + 1 > total) return total
      return prevState + 1
    })
  })
  useKey('ArrowLeft', () => {
    setSelectedWeek(prevState => {
      if (prevState - 1 < 0) return 0
      return prevState - 1
    })
  })

  const handleWeekChange = async event => {
    setSelectedWeek(event.target.value)
  }
  const handleSeasonChange = async event => {
    setSelectedSeason(event.target.value)
  }
  const handleCardStyleChange = event => {
    ls('modernCardStyle', event.target.checked)
    setModernCardStyle(event.target.checked)
  }

  return (
    <div>
      {selectedAnime && 
        <DetailsCard
          className={classes.selectedAnimeCard}
          selectedAnime={selectedAnime}
        />
      }
      {
        karmaGraphParams && 
        <KarmaGraphModal
          params={karmaGraphParams}
        />
      }
      {
        rpScoreGraphParams && 
        <RpGraphModal
          params={rpScoreGraphParams}
        />
      }
      <Grid
        container
        justify="center"
        spacing={2}
      >

        <Grid
          container
          justify="center"
        >
          <Grid
            container
            justify="center">
            <Grid item>
              <div>
                <FormControl 
                  className={classes.formControl}
                  variant="outlined"
                >
                  <Select 
                    className={classes.selectEmpty} 
                    native={isMobile} 
                    onChange={handleSeasonChange}
                    value={selectedSeason}
                  >
                    {seasonSelectOptions}
                  </Select>
                </FormControl>
                <FormControl 
                  className={classes.formControl}
                  variant="outlined"
                >
                  <Select 
                    className={classes.selectEmpty} 
                    native={isMobile} 
                    onChange={handleWeekChange}
                    value={selectedWeek}
                  >
                    {weekSelectOptions}
                  </Select>
                </FormControl>
              </div>
            </Grid>
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
                {!isMobileOnly &&
                  <Typography component="div">
                    <Grid component="label" container alignItems="center" spacing={1}>
                      <Grid item>Classic</Grid>
                      <Grid item>
                        <AntSwitch
                          checked={modernCardStyle}
                          onChange={handleCardStyleChange}
                          value={modernCardStyle}
                        />
                      </Grid>
                      <Grid item>Modern</Grid>
                    </Grid>
                  </Typography>
                }
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
