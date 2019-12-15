import React from 'react'
import PropTypes from 'prop-types'
import clsx from 'clsx'
import { withStyles } from '@material-ui/core/styles'
import { Link as RouterLink } from 'react-router-dom'
import Divider from '@material-ui/core/Divider'
import Drawer from '@material-ui/core/Drawer'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import HomeIcon from '@material-ui/icons/Home'
import ScoreIcon from '@material-ui/icons/Score'
import PollIcon from '@material-ui/icons/Poll'
import ForumIcon from '@material-ui/icons/Forum'

const categories = [
  {
    id: '/r/Anime',
    children: [
      { id: 'Karma Rankings', path: '/karma-rankings', icon: <ScoreIcon />},
      { id: 'Poll Rankings', path: '/poll-rankings', icon: <PollIcon /> },
      { id: 'Recent Discussions', path: '/discussions', icon: <ForumIcon /> },
    ],
  },
  {
    id: '/r/Manga',
    children: [
      { id: 'Karma Rankings', path: '', icon: <ScoreIcon /> },
      { id: 'Poll Rankings', path: '', icon: <PollIcon /> },
      { id: 'Recent Discussions', path: '', icon: <ForumIcon /> },
    ],
  },
];

const styles = theme => ({
  categoryHeader: {
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
  },
  categoryHeaderPrimary: {
    color: theme.palette.common.white,
  },
  item: {
    paddingTop: 1,
    paddingBottom: 1,
    color: 'rgba(255, 255, 255, 0.7)',
    '&:hover,&:focus': {
      backgroundColor: 'rgba(255, 255, 255, 0.08)',
    },
  },
  itemCategory: {
    backgroundColor: '#232f3e',
    boxShadow: '0 -1px 0 #404854 inset',
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
  },
  firebase: {
    fontFamily: 'Oswald',
    fontSize: 24,
    color: theme.palette.common.white,
  },
  itemActiveItem: {
    color: '#4fc3f7',
  },
  itemPrimary: {
    fontSize: 'inherit',
  },
  itemIcon: {
    minWidth: 'auto',
    marginRight: theme.spacing(2),
  },
  divider: {
    marginTop: theme.spacing(2),
  },
});

function Sidebar(props) {
  const { classes, ...other } = props;

  return (
    <Drawer variant="permanent" {...other}>
      <List disablePadding>
        <ListItem className={clsx(classes.firebase, classes.item, classes.itemCategory)}>
          <RouterLink to="/">
            <img
              alt="ANIRANKS Logo"
              src="/images/logos/logo_full_light_blue_wlb_stroke.png"
              height={48}
            />
          </RouterLink>
        </ListItem>
        <RouterLink style={{cursor: 'pointer'}} to='/dashboard'>
          <ListItem className={clsx(classes.item, classes.itemCategory, (window.location.pathname === '/dashboard') && classes.itemActiveItem)}>
            <ListItemIcon className={classes.itemIcon}>
              <HomeIcon />
            </ListItemIcon>
            <ListItemText
              classes={{
                primary: classes.itemPrimary,
              }}
            >
              Dashboard
            </ListItemText>
          </ListItem>
        </RouterLink>
        {categories.map(({ id, children }) => (
          <React.Fragment key={id}>
            <ListItem className={classes.categoryHeader}>
              <ListItemText
                classes={{
                  primary: classes.categoryHeaderPrimary,
                }}
              >
                {id}
              </ListItemText>
            </ListItem>
            {children.map(({ id: childId, path, icon }, index) => (
              <RouterLink key={index} to={path}>
                <ListItem
                  key={childId}
                  button
                  className={clsx(classes.item, (window.location.pathname === path) && classes.itemActiveItem)}
                >
                  <ListItemIcon className={classes.itemIcon}>{icon}</ListItemIcon>
                  <ListItemText
                    classes={{
                      primary: classes.itemPrimary,
                    }}
                  >
                    {childId}
                  </ListItemText>
                </ListItem>
              </RouterLink>
            ))}

            <Divider className={classes.divider} />
          </React.Fragment>
        ))}
      </List>
    </Drawer>
  );
}

Sidebar.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Sidebar);