import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

const useStyles = makeStyles(theme => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));

function createShowSeasonMenuItems(shows) {
  const showItems = shows.map((show, index) => {
    const name = show.title.length > 30 ? `${show.title.slice(0, 20)}...` : show.title
    return <MenuItem
      key={index}
      value={show.id}
    >{name}</MenuItem>
  })
  return showItems
}



export default function AssetSelect(props) {
  const classes = useStyles();
  const [show, setShow] = React.useState('')
  const [season, setSeason] = React.useState('')
  const [seasonItems, setSeasonItems] = React.useState([])

  const { shows, setSelectedAsset, setSelectedShow } = props

  const inputLabel = React.useRef(null);
  const [labelWidth, setLabelWidth] = React.useState(0);
  
  React.useEffect(() => {
    setLabelWidth(inputLabel.current.offsetWidth);
  }, [setLabelWidth]);

  function createSeasonItems(id) {
    const seasonItems = []

    for(const show of shows) {
      if (show.id === id) {
        const assets = show.Assets
        assets.sort((a, b) => a.season > b.season)
        for(const asset of show.Assets) {
          seasonItems.push(<MenuItem key={asset.id} value={asset.id}>{asset.season}</MenuItem> )
        }
        setSeason(assets[0].id)
        setSelectedAsset(assets[0].id)
        break
      }
    }  
    return seasonItems
  }

  const handleShowChange = event => {
    setSeasonItems(createSeasonItems(event.target.value))
    setShow(event.target.value);
    for (const s of shows) {
      if (s.id === event.target.value) {
        setSelectedShow(s)
        break
      }
    }
  }
  const handleSeasonChange = event => {
    setSelectedAsset(event.target.value)
    setSeason(event.target.value);
  }

  const showItems = createShowSeasonMenuItems(shows)

  return (
    <div>
      <FormControl
        className={classes.formControl}
        variant="outlined"
      >
        <InputLabel ref={inputLabel}>
          Show
        </InputLabel>
        <Select
          onChange={handleShowChange}
          value={show}
          labelWidth={labelWidth}
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          {showItems}
        </Select>
      </FormControl>
      <FormControl
        className={classes.formControl}
        variant="filled"
      >
        <InputLabel id="season-select">
          Season
        </InputLabel>
        <Select
          onChange={handleSeasonChange}
          value={season}
        >
          {seasonItems}
        </Select>
      </FormControl>
    </div>
  );
}