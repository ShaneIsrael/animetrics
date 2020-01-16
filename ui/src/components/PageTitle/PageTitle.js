import React from 'react';
import { Button } from '@material-ui/core'

// styles
import useStyles from './styles'

// components
import { Typography } from '../Wrappers/Wrappers'

export default function PageTitle(props) {
  var classes = useStyles();

  return (
    <div className={classes.pageTitleContainer}>
      <Typography
        className={classes.typo}
        size="sm"
        variant="h1"
      >
        {props.title}
      </Typography>
      {props.button && (
        <Button
          classes={{ root: classes.button }}
          color="secondary"
          size="large"
          variant="contained"
        >
          {props.button}
        </Button>
      )}
    </div>
  );
}
