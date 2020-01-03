import React from 'react'
import { makeStyles } from '@material-ui/styles'
import clsx from 'clsx'
import {isMobile, isMobileOnly} from 'react-device-detect'
// eslint-disable-next-line
import { Grid, Paper, FormControl, Select, MenuItem, Typography } from '@material-ui/core'

import { TopTenService } from 'services'
import { TopTenCard } from './components'

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  paperWrapper: {
    padding: isMobileOnly ? 5 : 10,
    width: '100%',
    maxWidth: isMobileOnly ? 400 : 700
  },
}))

const desktopYearSelectOptions = [
  <MenuItem key={0} value={2019}>Top 10 of 2019</MenuItem>,
  <MenuItem key={1} value={2018}>Top 10 of 2018</MenuItem>,
]
const mobileYearSelectOptions = [
  <option key={0} value={2019}>Top 10 of 2019</option>,
  <option key={1} value={2018}>Top 10 of 2018</option>,
]

const desktopScoreTypeSelectOptions = [
  <MenuItem key={0} value={'karma'}>By Karma</MenuItem>,
  <MenuItem key={1} value={'poll'}>By Reddit Poll</MenuItem>,
  <MenuItem key={2} value={'ral'}>By RedditAnimeList</MenuItem>,
]
const mobileScoreTypeSelectOptions = [
  <option key={0} value={'karma'}>By Karma</option>,
  <option key={1} value={'poll'}>By Reddit Poll</option>,
  <option key={2} value={'ral'}>By RedditAnimeList</option>,
]


function createTopFiveCards(topFiveResults, type) {
  return topFiveResults.map((elem, i) => {
    const title = elem.show.english_title ? elem.show.english_title : elem.show.title
    const score = type === 'karma' ? Math.round(elem.avg) : elem.avg.toFixed(2)
    return <TopTenCard 
      key={i} 
      title={title} 
      poster={elem.poster} 
      position={i+1} 
      score={score} 
      malId={elem.show.mal_id} 
      type={type} 
    />
  })
}

const TopFive = () => {
  const classes = useStyles()

  const [selectedYear, setSelectedYear] = React.useState(2019)
  const [selectedScoreType, setSelectedScoreType] = React.useState('karma')
  const [topFiveCards, setTopFiveCards] = React.useState([])

  const handleScoreTypeChange = (event) => {
    setSelectedScoreType(event.target.value)
  }
  const handleYearChange = (event) => {
    setSelectedYear(event.target.value)
  }

  React.useEffect(() => {
    async function fetch() {
      const results = (await TopTenService.getYearlyTopTen(selectedYear, selectedScoreType)).data
      setTopFiveCards(createTopFiveCards(results, selectedScoreType))
    }
    fetch()
  }, [selectedYear, selectedScoreType])

  return (
    <div className={classes.root}>
      <Grid
        container
        justify="center"
        // spacing={2}
      >

        <Grid
          container
          justify="center"
        >
          <Grid
            container
            justify={isMobileOnly ? 'flex-start' : 'center'}>
            <Grid item>
              <div>
                <FormControl 
                  className={classes.formControl}
                  variant="outlined"
                >
                  <Select 
                    className={classes.selectEmpty} 
                    native={isMobile} 
                    onChange={handleYearChange}
                    value={selectedYear}
                  >
                    {isMobile ? mobileYearSelectOptions : desktopYearSelectOptions}
                  </Select>
                </FormControl>
                <FormControl 
                  className={classes.formControl}
                  variant="outlined"
                >
                  <Select 
                    className={classes.selectEmpty} 
                    native={isMobile} 
                    onChange={handleScoreTypeChange}
                    value={selectedScoreType}
                  >
                    {isMobile ? mobileScoreTypeSelectOptions : desktopScoreTypeSelectOptions}
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
                className={clsx({[classes.paperWrapper]: true})}
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
                  {topFiveCards}
                </Grid>
              </Paper>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </div>
  )
}

export default TopFive
