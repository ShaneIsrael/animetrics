import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';

import { Paper, Grid } from "@material-ui/core";
import {
  Chart,
  ArgumentAxis,
  ValueAxis,
  SplineSeries,
  Title
} from "@devexpress/dx-react-chart-material-ui"

import { SeasonService } from '../../../../services'
import { Typography } from '@material-ui/core';
import { ValueScale, HoverState } from '@devexpress/dx-react-chart';


const generateData = (dataPoints) => {
  const data = []
  for (const dp of dataPoints) {
    data.push({ episode: `EP ${dp.episode}`, score: dp.score })
  }
  return data;
}

const createMinMax = (dataPoints) => {
  let min = null
  let max = null
  for (const dp of dataPoints) {
    if (min === null && max === null) {
      min = dp.score
      max = dp.score
    } else {
      if (min > dp.score) min = dp.score
      if (max < dp.score) max = dp.score
    }
  }
  if (max + 2 >= 10) max = 10
  else max = max + 2
  if (min - 2 <= 0) min = 0
  else min = min - 2
  return [min, max]
}


const Text = (props) => {
  const { text } = props;
  const [mainText, subText] = text.split('\\n');
  return (
    <Grid container justify="center">
      <Typography variant="h5">
        {mainText}
      </Typography>
      <Typography variant="body1">
        {subText}
      </Typography>
    </Grid>
  )
}


const useStyles = makeStyles(theme => ({
  link: {
    color: theme.palette.primary.main
  },
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
  },
}))

export default function RpGraphModal(props) {
  const classes = useStyles();
  const [ hide, setHide ] = React.useState(false)
  const { params } = props

  const [open, setOpen] = React.useState(false);
  const [data, setData] = React.useState([])
  const [minMax, setMinMax] = React.useState([0, 10])
  const handleClose = () => {
    setOpen(false)
  }

  React.useEffect(() => {
    async function fetchData() {
      try {
        const seasonEpisodeScore = (await SeasonService.getAllShowEpisodeRedditPollScoreBySeason(params.seasonId, params.showId)).data
        setMinMax(createMinMax(seasonEpisodeScore))
        setData(generateData(seasonEpisodeScore))
      } catch (err) {
        console.log(err)
      }
    }
    if (params.seasonId && params.showId) {
      setOpen(true)
      setHide(false)
      fetchData()
    }
  }, [params])

  return (
    <div>
      {!hide && 
        <div>
          <Modal
            aria-labelledby="transition-modal-title"
            aria-describedby="transition-modal-description"
            className={classes.modal}
            open={open}
            onClose={handleClose}
            closeAfterTransition
            BackdropComponent={Backdrop}
            BackdropProps={{
              timeout: 500,
            }}
          >
            <Fade in={open}>
              <Paper>
                <Chart data={data} width={650} height={500}>
                  <ValueScale modifyDomain={() => minMax} />
                  <ArgumentAxis showGrid showLabels />
                  <ValueAxis />
                  <HoverState />
                  <Title
                    text="Reddit Poll Score Over Time"
                    textComponent={Text}
                  />
                  <SplineSeries valueField="score" argumentField="episode" />
                </Chart>
              </Paper>
            </Fade>
          </Modal>
        </div>
      }
    </div>
  )
}