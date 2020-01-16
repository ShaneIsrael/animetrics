import React, { useState } from 'react';
import { Grid } from '@material-ui/core';
import { useTheme } from '@material-ui/styles';
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Sector,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

// components
import Widget from 'components/Widget/Widget';
import ApexLineChart from './components/ApexLineChart';
import ApexHeatmap from './components/ApexHeatmap';
import PageTitle from 'components/PageTitle/PageTitle';

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
];

const pieChartData = [
  { name: 'Group A', value: 400 },
  { name: 'Group B', value: 300 },
  { name: 'Group C', value: 300 },
  { name: 'Group D', value: 200 },
];

export default function Charts() {
  var theme = useTheme();

  // local
  var [activeIndex, setActiveIndexId] = useState(0);

  return (
    <>
      <PageTitle
        button="Latest Reports"
        title="Charts Page - Data Display"
      />
      <Grid
        container
        spacing={4}
      >
        <Grid
          item
          md={6}
          xs={12}
        >
          <Widget
            noBodyPadding
            title="Apex Line Chart"
            upperTitle
          >
            <ApexLineChart />
          </Widget>
        </Grid>
        <Grid
          item
          md={6}
          xs={12}
        >
          <Widget
            noBodyPadding
            title="Apex Heatmap"
            upperTitle
          >
            <ApexHeatmap />
          </Widget>
        </Grid>
        <Grid
          item
          md={8}
          xs={12}
        >
          <Widget
            noBodyPadding
            title="Simple Line Chart"
            upperTitle
          >
            <ResponsiveContainer
              height={350}
              width="100%"
            >
              <LineChart
                data={lineChartData}
                height={300}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
                width={500}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis tick={{fill: theme.palette.secondary.main}} dataKey="name" />
                <YAxis tick={{fill: theme.palette.primary.main}} />
                <Tooltip contentStyle={{background: theme.palette.primary.dark}} />
                <Legend />
                <Line
                  activeDot={{ r: 8 }}
                  dataKey="pv"
                  stroke={theme.palette.primary.main}
                  strokeWidth={2}
                  type="monotone"
                />
                <Line
                  dataKey="uv"
                  stroke={theme.palette.secondary.main}
                  strokeWidth={2}
                  type="monotone"
                />
              </LineChart>
            </ResponsiveContainer>
          </Widget>
        </Grid>
        <Grid
          item
          md={4}
          xs={12}
        >
          <Widget
            noBodyPadding
            title="Pie Chart with Tooltips"
            upperTitle
          >
            <ResponsiveContainer
              height={300}
              width="100%"
            >
              <PieChart
                height={300}
                width={200}
              >
                <Pie
                  activeIndex={activeIndex}
                  activeShape={renderActiveShape}
                  cx={200}
                  cy={150}
                  data={pieChartData}
                  dataKey="value"
                  fill={theme.palette.primary.main}
                  innerRadius={60}
                  onMouseEnter={(e, id) => setActiveIndexId(id)}
                  outerRadius={80}
                />
              </PieChart>
            </ResponsiveContainer>
          </Widget>
        </Grid>
      </Grid>
    </>
  );
}

// ################################################################

function renderActiveShape(props) {
  var RADIAN = Math.PI / 180;
  var {
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    startAngle,
    endAngle,
    fill,
    payload,
    percent,
    value,
  } = props;
  var sin = Math.sin(-RADIAN * midAngle);
  var cos = Math.cos(-RADIAN * midAngle);
  var sx = cx + (outerRadius + 10) * cos;
  var sy = cy + (outerRadius + 10) * sin;
  var mx = cx + (outerRadius + 30) * cos;
  var my = cy + (outerRadius + 30) * sin;
  var ex = mx + (cos >= 0 ? 1 : -1) * 22;
  var ey = my;
  var textAnchor = cos >= 0 ? 'start' : 'end';

  return (
    <g>
      <text
        dy={8}
        fill={fill}
        textAnchor="middle"
        x={cx}
        y={cy}
      >
        {payload.name}
      </text>
      <Sector
        cx={cx}
        cy={cy}
        endAngle={endAngle}
        fill={fill}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
      />
      <Sector
        cx={cx}
        cy={cy}
        endAngle={endAngle}
        fill={fill}
        innerRadius={outerRadius + 6}
        outerRadius={outerRadius + 10}
        startAngle={startAngle}
      />
      <path
        d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`}
        fill="none"
        stroke={fill}
      />
      <circle
        cx={ex}
        cy={ey}
        fill={fill}
        r={2}
        stroke="none"
      />
      <text
        fill="white"
        textAnchor={textAnchor}
        x={ex + (cos >= 0 ? 1 : -1) * 12}
        y={ey}
      >{`PV ${value}`}</text>
      <text
        dy={18}
        fill="#999"
        textAnchor={textAnchor}
        x={ex + (cos >= 0 ? 1 : -1) * 12}
        y={ey}
      >
        {`(Rate ${(percent * 100).toFixed(2)}%)`}
      </text>
    </g>
  );
}
