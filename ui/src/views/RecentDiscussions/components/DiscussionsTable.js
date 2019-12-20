import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableContainer from '@material-ui/core/TableContainer'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import { Button, IconButton, Grid, Typography, Avatar } from '@material-ui/core'
import moment from 'moment'
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos'
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos'

const columns = [
  { id: 'action', label: '', align: 'left', minWidth: 50 },
  { id: 'avatar', label: '', align: 'left', minWidth: 50 },
  { id: 'title', label: 'Title', minWidth: 25 },
  { id: 'season', label: 'Season', minWidth: 25 },
  { id: 'episode', label: 'Episode', minWidth: 25 },
  { id: 'date', label: 'Posted', minWidth: 50},
]

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
  },
  container: {
    maxHeight: '80vh',
  },
  extendedIcon: {
    marginRight: theme.spacing(1),
  },
  avatar: {
    width: 50,
    height: 50,
  },
  tableHeadCell: {
    backgroundColor: '#18202c'
  }
}))



export default function DiscussionsTable(props) {
  const classes = useStyles()
  const { discussions, query, fetchHandler } = props

  const [page, setPage] = React.useState(0)
  const [rowsPerPage, setRowsPerPage] = React.useState(25)
  const [rows, setRows] = React.useState([])

  const createViewButton = React.useCallback(href => {
    return (
      <Button variant="outlined" color="primary" onClick={() => window.open(href, '_blank')}>
        view
      </Button>
    )
  }, [])

  const createAvatar = React.useCallback(url => {
    return (
      <Avatar className={classes.avatar} src={`https://animetrics.sfo2.cdn.digitaloceanspaces.com/${url}`} />
    )
  }, [classes.avatar])

  const createRows = React.useCallback(discussions => {
    return discussions.map((d, idx) => {
      const utcDate = moment.utc(d.post_created_dt)
      const localDate = moment(utcDate).local()
      return {key: idx, action: createViewButton(d.post_url), avatar: createAvatar(d.Show.Assets[0].s3_avatar), title: d.Show.title, season: d.season, episode: d.episode, date: localDate.format('LLL')}
    })
  }, [createViewButton, createAvatar])

  React.useEffect(() => {
      setRows(createRows(discussions))
  }, [discussions, createRows])

  const handleChangePage = async (newPage) => {
    const discussions = await fetchHandler(newPage, rowsPerPage, query)
    if (discussions.length > 0) {
      setPage(newPage)
      setRows(createRows(discussions))
    }
  }

  return (
    <Paper className={classes.root}>
      <TableContainer className={classes.container}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map(column => (
                <TableCell
                  className={classes.tableHeadCell}
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map(row => {
              return (
                <TableRow hover role="checkbox" tabIndex={-1} key={row.key}>
                  {columns.map(column => {
                    const value = row[column.id]
                    return (
                      <TableCell key={column.id} align={column.align}>
                        {column.format && typeof value === 'number' ? column.format(value) : value}
                      </TableCell>
                    )
                  })}
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <Paper style={{height: 40}}>
        <Grid container direction="row">
          <Grid item xs/>
          <Grid item>
            <IconButton style={{marginRight: 10}} aria-label="page left" disabled={page === 0} onClick={() => handleChangePage(page - 1)}>
              <ArrowBackIosIcon />
            </IconButton>
          </Grid>
          <Grid item>
            <Typography style={{marginTop: 3}} variant="h5">{page + 1}</Typography>
          </Grid>
          <Grid item>
            <IconButton style={{marginLeft: 10}} aria-label="page right" disabled={rows.length < rowsPerPage} onClick={() => handleChangePage(page + 1)}>
              <ArrowForwardIosIcon />
            </IconButton>
          </Grid>
          <Grid item xs/>
        </Grid>
      </Paper>
      {/* <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onChangePage={handleChangePage}
        // onChangeRowsPerPage={handleChangeRowsPerPage}
      /> */}
    </Paper>
  )
}