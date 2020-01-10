import React from 'react'
import { makeStyles } from '@material-ui/styles'
import { ExpansionPanel, ExpansionPanelDetails, ExpansionPanelSummary, Typography} from '@material-ui/core'
import { LazyLoadImage } from 'components'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { ResourceService } from 'services'

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
  },
}))


function getSeason(season) {
  season = Number(season)
  if (season === 3) return 'Fall'
  if (season === 2) return 'Summer'
  if (season === 1) return 'Spring'
  else return 'Winter'
}

const ReddadzWeeklyCharts = (props) => {
  const classes = useStyles()
  const [chartData, setChartData] = React.useState(null)

  React.useEffect(() => {
    async function fetch() {
      try {
        const rwc = (await ResourceService.getReddadzWeeklyCharts()).data
        setChartData(rwc)
      } catch (err) {
        console.log(err)
      }
    }
    if(!chartData) fetch()
  })


  function createExpansionPanel(title, imageUrl) {
    return (
      <ExpansionPanel key={title}>
        <ExpansionPanelSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls={`${title}-content`}
          id={`${title}-header`}
        >
          <Typography className={classes.heading}>{title}</Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          <LazyLoadImage 
            src={imageUrl}
            alt={`${title} Chart Image`}
            width="100%"
          />
        </ExpansionPanelDetails>
      </ExpansionPanel>
    )
  }

  let panels = []
  if (chartData) {
    let temp = chartData
    for (const year of Object.keys(temp)) {
      // we want the annual entry at the top, thus this sort.
      for (const season of Object.keys(temp[year]).sort((a, b) => {
        if (isNaN(a)) return -1
        else return 0
      })) {
        if (season === 'annual') {
          panels.push(
            createExpansionPanel(`${year} / Annual Overview`, temp[year]['annual'])
          )
        }
        else {
          // we want the weeks to go from largest to smallest, coincidentally, this also puts season overview at the top where we want it.
          for(const week of Object.keys(temp[year][season]).reverse()) {
            if (week === 'season') {
              panels.push(
                createExpansionPanel(`${year} / ${getSeason(season)} / Season Overview`, temp[year][season]['season'])
              )
            } else {
              panels.push(
                createExpansionPanel(`${year} / ${getSeason(season)} / Week ${week}`, temp[year][season][week])
              )
            }
          }
        }
      }
    }
  }

  return (
    <div className={classes.root}>
      {panels}
    </div>
  )
}

export default ReddadzWeeklyCharts
