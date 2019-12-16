/* eslint-disable react/no-multi-comp */
import React, {useEffect} from 'react'
import { makeStyles } from '@material-ui/styles'
// eslint-disable-next-line
import { Grid, Paper, InputLabel, FormControl, Select, MenuItem } from '@material-ui/core'
import clsx from 'clsx'
import { ShowService, AssetService } from 'services'
import { AssetSelect, AssetOverrideCard, DetailsOverrideCard } from './components'



const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(1),
  },

}))



const Overrides = () => {
  const classes = useStyles()
  const [shows, setShows] = React.useState([])
  const [asset, setAsset] = React.useState(null)
  const [show, setShow] = React.useState(null)
  // eslint-disable-next-line

  useEffect(() => {
    async function fetchData() {
      try {
        const shows = (await ShowService.getShowsAndAssets()).data
        setShows(shows)
      } catch (err) {
        console.log(err)
      }
    }
    fetchData()
  }, [])

  const setSelectedAsset = async (id) => {
    // get the asset with this id
    const a = (await AssetService.getAsset(id)).data
    setAsset(a)
  }
  const setSelectedShow = async (s) => {
    // get the asset with this id
    setShow(s)
  }

  return (
    <div className={clsx({[classes.root]: true})}>
      <Grid
        container
        justify="center"
        spacing={4}
      >
        <Grid item xs={4}>
          <AssetSelect shows={shows} setSelectedAsset={setSelectedAsset} setSelectedShow={setSelectedShow}/>
        </Grid>
      </Grid>
      <Grid
        container
        justify="center"
        spacing={4}>
        {asset && 
          <React.Fragment>
            <Grid item>
              <AssetOverrideCard assetId={asset.id} type="poster" assetUrl={asset.s3_poster} title="Override Poster Art" subtitle="For best results please use: Dimensions [680 x 1000]"/>
            </Grid>
            <Grid item >
              <AssetOverrideCard assetId={asset.id} type="banner" assetUrl={asset.s3_banner} title="Override Banner Art" subtitle="For best results please use: Dimensions [454 x 80]"/>
            </Grid>
            <Grid item >
              <AssetOverrideCard assetId={asset.id} type="avatar" assetUrl={asset.s3_avatar} title="Override Avatar Art" subtitle="For best results please use: Dimensions [162 x 162]"/>
            </Grid>
            <Grid item >
              <DetailsOverrideCard showToUpdate={show} type="tvdb_id" title="Override TVDB ID" subtitle="If the following synopsis is incorrect, find the correct tvdb id at https://thetvdb.com/"/>
            </Grid>
          </React.Fragment>
        }
      </Grid>
    </div>
  )
}

export default Overrides
