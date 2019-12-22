/* eslint-disable react/no-multi-comp */
import React from 'react'
import { makeStyles } from '@material-ui/styles'
// eslint-disable-next-line
import { Grid, Paper, InputLabel, FormControl, Select, MenuItem, TextField } from '@material-ui/core'
import clsx from 'clsx'
import { DiscussionService } from 'services'
import { DiscussionsTable } from './components'

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(1),
    '& > *': {
      margin: theme.spacing(1),
      width: '100%',
      paddingRight: theme.spacing(2),
    }
  },
}))

const RecentDiscussions = () => {
  const classes = useStyles()

  const [discussionQuery, setDiscussionQuery] = React.useState('')
  const [discussions, setDiscussions] = React.useState([])

  const defaultQuery = ''
  async function getPagedDiscussions(page, size, query) {
    try {
      const discussions = (await DiscussionService.getPagedDiscussions(page, size, query)).data
      return discussions
    } catch (err) {
      console.log(err)
    }
  }

  async function onSubmit(e) {
    e.preventDefault()
    try {
      const discussions = (await DiscussionService.getPagedDiscussions(0, 25, discussionQuery)).data
      setDiscussions(discussions)
    } catch (err) {
      console.log(err)
    }
  }

  React.useEffect(() => {
    async function fetch() {
      try {
        const discussions = (await DiscussionService.getPagedDiscussions(0, 25, defaultQuery)).data
        setDiscussions(discussions)
      } catch (err) {
        console.log(err)
      }
    }
    fetch()
  }, [defaultQuery])

  return (
    <div className={clsx({[classes.root]: true})}>
      <Grid
        container
        justify="center"
        spacing={4}
      >
        <Grid
                    item
          xs={12}
        >
          <form
                        autoComplete="off"
                        className={classes.root}
                        noValidate
                        onSubmit={onSubmit}
          >
            <TextField
                            autoFocus
                            id="outlined-basic"
                            label="Series Title"
                            onChange={(event) => setDiscussionQuery(event.target.value)}
                            placeholder={'No Game No Life'}
                            variant="outlined"
            />
          </form>
          <DiscussionsTable
                        discussions={discussions}
                        fetchHandler={getPagedDiscussions}
                        query={discussionQuery}
          />
        </Grid>
      </Grid>
    </div>
  )
}

export default RecentDiscussions
