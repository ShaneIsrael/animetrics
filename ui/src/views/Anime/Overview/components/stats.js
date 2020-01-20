import React from 'react'
import { Grid } from '@material-ui/core'
import { makeStyles, useTheme } from '@material-ui/styles'

import {
  defs,
  linearGradient,
  stop,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  Area,
  AreaChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Sector,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

// components
import Widget from 'components/Widget/Widget'

const useStyles = makeStyles(theme => ({
}))

const lineChartData = [
  {
    name: 'Page A',
    uv: 4000,
    pv: 2400,
    amt: 2400,
  },
  {
    name: 'Page B',
    uv: 3000,
    pv: 1398,
    amt: 2210,
  },
  {
    name: 'Page C',
    uv: 2000,
    pv: 9800,
    amt: 2290,
  },
  {
    name: 'Page D',
    uv: 2780,
    pv: 3908,
    amt: 2000,
  },
  {
    name: 'Page E',
    uv: 1890,
    pv: 4800,
    amt: 2181,
  },
  {
    name: 'Page F',
    uv: 2390,
    pv: 3800,
    amt: 2500,
  },
  {
    name: 'Page G',
    uv: 3490,
    pv: 4300,
    amt: 2100,
  },
]

export default function Stats(props) {
  const classes = useStyles()
  const theme = useTheme()

  const { stats } = props

  console.log(stats)
  return (
    <Grid
      container
      item
      sm={12}
      spacing={1}
    >
      <Grid
        item
        md={12}
        xs={12}
      >
        <Widget
          noBodyPadding
          title="Season Popularity"
          upperTitle
          disableWidgetMenu={true}
        >
          <ResponsiveContainer
            height={250}
            width="100%"
          >
            <AreaChart
              data={stats.seasonalKarma}
              // height={200}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
              // width={500}
            >
              <defs>
                <linearGradient id="colorKarma" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={theme.palette.primary.main} stopOpacity={0.8}/>
                  <stop offset="95%" stopColor={theme.palette.primary.main} stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorComments" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={theme.palette.secondary.main} stopOpacity={0.8}/>
                  <stop offset="95%" stopColor={theme.palette.secondary.main} stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="name"
                tick={{fill: theme.palette.primary.main}}
              />
              <YAxis tick={{fill: theme.palette.primary.main}} />
              <Tooltip contentStyle={{background: theme.palette.primary.dark}} />
              <Legend />
              <Area
                activeDot={{ r: 8 }}
                dataKey="karma"
                stroke={theme.palette.primary.main}
                strokeWidth={2}
                type="monotone"
                fill="url(#colorKarma)"
              />
              <Area
                activeDot={{ r: 8 }}
                dataKey="comments"
                stroke={theme.palette.secondary.main}
                strokeWidth={2}
                type="monotone"
                fill="url(#colorComments)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </Widget>
      </Grid>

      <Grid
        item
        md={12}
        xs={12}
      >
        <Widget
          noBodyPadding
          title="Season Ratings"
          upperTitle
          disableWidgetMenu={true}
        >
          <ResponsiveContainer
            height={250}
            width="100%"
          >
            <LineChart
              data={stats.seasonalRatings}
              // height={200}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
              // width={500}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="name"
                tick={{fill: theme.palette.primary.main}}
              />
              <YAxis tick={{fill: theme.palette.primary.main}} type='number' domain={[dataMin => dataMin - 1, 10]} />
              <Tooltip contentStyle={{background: theme.palette.primary.dark}} />
              <Legend />
              <Line
                activeDot={{ r: 8 }}
                dataKey="RedditAnimeList"
                stroke={theme.palette.primary.main}
                strokeWidth={2}
                type="monotone"
              />
              <Line
                activeDot={{ r: 8 }}
                dataKey="MyAnimeList"
                stroke={theme.palette.secondary.main}
                strokeWidth={2}
                type="monotone"
              />
            </LineChart>
          </ResponsiveContainer>
        </Widget>
      </Grid>
    </Grid>
  )
}