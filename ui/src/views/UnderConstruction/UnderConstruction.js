import React from 'react'
import { makeStyles } from '@material-ui/styles'
import { Typography } from '@material-ui/core'

const useStyles = makeStyles(() => ({
  root: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%'
  },
}))

const UnderConstruction = (props) => {
  const classes = useStyles()
  console.log(props.match.params['0'])
  return (
    <div className={classes.root}>
      <Typography variant="h3">Coming Soon!</Typography>
    </div>
  )
}

export default UnderConstruction
