import React, { useState } from 'react';
import {
  Paper,
  IconButton,
  Menu,
  MenuItem,
  Typography,
} from '@material-ui/core';
import { MoreVert as MoreIcon } from '@material-ui/icons';
import classnames from 'classnames';

// styles
import useStyles from './styles';

export default function Widget({
  children,
  title,
  noBodyPadding,
  bodyClass,
  disableWidgetMenu,
  header,
  ...props
}) {
  var classes = useStyles();

  // local
  var [moreButtonRef, setMoreButtonRef] = useState(null);
  var [isMoreMenuOpen, setMoreMenuOpen] = useState(false);

  return (
    <div className={classes.widgetWrapper}>
      <Paper
        classes={{ root: classes.widgetRoot }}
        className={classes.paper}
      >
        <div className={classes.widgetHeader}>
          {header ? (
            header
          ) : (
            <React.Fragment>
              <Typography
                color="textSecondary"
                variant="h5"
              >
                {title}
              </Typography>
              {!disableWidgetMenu && (
                <IconButton
                  aria-haspopup="true"
                  aria-owns="widget-menu"
                  buttonRef={setMoreButtonRef}
                  classes={{ root: classes.moreButton }}
                  color="primary"
                  onClick={() => setMoreMenuOpen(true)}
                >
                  <MoreIcon />
                </IconButton>
              )}
            </React.Fragment>
          )}
        </div>
        <div
          className={classnames(classes.widgetBody, {
            [classes.noPadding]: noBodyPadding,
            [bodyClass]: bodyClass,
          })}
        >
          {children}
        </div>
      </Paper>
      <Menu
        anchorEl={moreButtonRef}
        disableAutoFocusItem
        id="widget-menu"
        onClose={() => setMoreMenuOpen(false)}
        open={isMoreMenuOpen}
      >
        <MenuItem>
          <Typography>Edit</Typography>
        </MenuItem>
        <MenuItem>
          <Typography>Copy</Typography>
        </MenuItem>
        <MenuItem>
          <Typography>Delete</Typography>
        </MenuItem>
        <MenuItem>
          <Typography>Print</Typography>
        </MenuItem>
      </Menu>
    </div>
  );
}
