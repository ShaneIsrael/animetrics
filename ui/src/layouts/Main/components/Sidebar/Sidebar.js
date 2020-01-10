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
import HelpIcon from '@material-ui/icons/Help'
import WarningIcon from '@material-ui/icons/Warning'
import RateReviewIcon from '@material-ui/icons/RateReview'
import LocalCafeIcon from '@material-ui/icons/LocalCafe'
import Filter9PlusIcon from '@material-ui/icons/Filter9Plus'
import PhotoLibraryIcon from '@material-ui/icons/PhotoLibrary'

import FeedbackDialog from '../../../../components/Dialog/FeedbackDialog'
import IssueDialog from '../../../../components/Dialog/IssueDialog'

const categories = [
  {
    id: '/r/Anime',
    children: [
      { id: 'Karma Rankings', path: '/anime/karma-rankings', icon: <ScoreIcon />},
      { id: 'Poll Rankings', path: '/anime/poll-rankings', icon: <PollIcon /> },
      { id: 'Top 10 Anime', path: '/anime/top-ten', icon: <Filter9PlusIcon />},
      { id: 'Discussion Finder', path: '/anime/discussions', icon: <ForumIcon /> },
    ],
  },
  {
    id: 'Resources',
    children: [
      { id: 'Reddadz Charts', path: '/resources/rwc', icon: <PhotoLibraryIcon /> },
    ],
  },
  {
    id: 'Help / Support',
    children: [
      { id: 'About Animetrics', path: '/legend', icon: <HelpIcon /> },
      { id: 'Report Issue', icon: <WarningIcon /> },
    ],
  },
  {
    id: 'Support Animetrics',
    children: [
      { id: 'Send Feedback', icon: <RateReviewIcon /> },
      { id: 'Donate', path: 'https://donorbox.org/animetrics-website-support', icon: <LocalCafeIcon /> },
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
  const [ feedbackOpen, setFeedbackOpen ] = React.useState(false)
  const [ reportIssueOpen, setReportIssueOpen ] = React.useState(false)
  const { classes, ...other } = props;

  const handleReportIssueClose  = () => {
    setReportIssueOpen(false)
  }
  const handleFeedbackClose  = () => {
    setFeedbackOpen(false)
  }

  return (
    <React.Fragment>
      <FeedbackDialog
        handleClose={handleFeedbackClose}
        open={feedbackOpen}
      />
      <IssueDialog
        handleClose={handleReportIssueClose}
        open={reportIssueOpen}
      />
      <Drawer
        variant="permanent"
        {...other}
      >
        <List disablePadding>
          <ListItem className={clsx(classes.firebase, classes.item, classes.itemCategory)}>
            {/* <RouterLink to={window.location.pathname}>

            </RouterLink> */}
            <img
              alt="Animetrics Logo"
              height={48}
              onClick={() => window.location.reload()}
              src="/images/logos/logo_full_light_blue_wlb_stroke.png"
              style={{cursor: 'pointer'}}
            />
          </ListItem>
          <RouterLink
            style={{cursor: 'pointer'}}
            to="/"
          >
            <ListItem className={clsx(classes.item, classes.itemCategory, (window.location.pathname === '/') && classes.itemActiveItem)}>
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
              {children.map(({ id: childId, path, icon }, index) => {
                let onClick = null
                if (childId === 'Send Feedback') {
                  return <ListItem
                    button
                    className={clsx(classes.item, (window.location.pathname === path) && classes.itemActiveItem)}
                    key={childId}
                    onClick={() => setFeedbackOpen(true)}
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
                }
                if (childId === 'Report Issue') {
                  return <ListItem
                    button
                    className={clsx(classes.item, (window.location.pathname === path) && classes.itemActiveItem)}
                    key={childId}
                    onClick={() => setReportIssueOpen(true)}
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
                }
                if (childId === 'Donate') {
                  return <ListItem
                    button
                    className={clsx(classes.item)}
                    key={childId}
                    onClick={() => window.open(path, '_blank')}
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
                }
                return <RouterLink
                  key={index}
                  to={path}
                >
                  <ListItem
                    button
                    className={clsx(classes.item, (window.location.pathname === path) && classes.itemActiveItem)}
                    key={childId}
                    onClick={onClick}
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
              })}

              <Divider className={classes.divider} />
            </React.Fragment>
          ))}
        </List>
      </Drawer>
    </React.Fragment>
  )
}

Sidebar.propTypes = {
  classes: PropTypes.object.isRequired,
}

export default withStyles(styles)(Sidebar)